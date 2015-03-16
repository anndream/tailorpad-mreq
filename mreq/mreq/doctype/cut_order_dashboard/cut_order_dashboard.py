# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _, msgprint
from frappe.utils import cint, nowtime, nowdate, flt, now, cstr
from erpnext.stock.utils import get_incoming_rate
from frappe.model.document import Document
from tools.tools_management.custom_methods import get_fabric_details, get_warehouse, get_branch, get_series, get_fabric_details, make_material_request
from tools.custom_data_methods import get_user_branch, get_branch_cost_center, get_branch_warehouse, update_serial_no, find_next_process

class CutOrderDashboard(Document):

	def get_invoice_details(self):
		self.set('cut_order_item', [])
		args = self.get_cut_order_details()
		if args:
			for co in args:
				if co.actual_site == co.fabric_site and co.fabric_site == get_user_branch():
					self.create_cut_order(co)
				elif co.fabric_site == get_user_branch():
					self.create_cut_order(co)
				elif get_user_branch == get_ActualFabric(co):
					self.create_cut_order(co)
		self.save()

	def update_data(self):
		self.save()

	def create_cut_order(self, co):
		customer=frappe.db.get_value('Sales Invoice',co['invoice_no'],'customer')
		coi = self.append('cut_order_item', {})
		coi.invoice_no = co['invoice_no']
		coi.customer = frappe.db.get_value('Sales Invoice',co['invoice_no'],'customer') if co['invoice_no'] else ''
		coi.article_code = co['article_code']
		coi.fabric_code = co['fabric_code']
		coi.fabric_qty = co['qty']
		coi.actual_site = co['actual_site']
		coi.fabric_site = co['fabric_site']
		coi.cut_order_id = co['name']

	def get_ActualFabric(self, args):
		return frappe.db.get_value('Sales Invoice', args.invoice_no, 'branch')

	def get_cut_order_details(self):
		return frappe.db.sql("""select invoice_no, article_code, 
				fabric_code, qty, 
				article_serial_no, 
				actual_site, fabric_site, name from `tabCut Order` 
			where ifnull(docstatus, 0) not in (1,2)  order by invoice_no desc""", as_dict=1)

	def cut_order(self):
		msg_status, msg = 'true', ''
		issue_list, out_list = [], []
		for item in self.cut_order_item:
			if cint(item.select) == 1:
				status, msg = self.validate_actual_qty(item)
				if status == 'true':
					if item.actual_site == item.fabric_site:
						# use in same branch
						name = self.Assign_FabricTo_ProcessAllotment(item)
					else:
						if get_user_branch() == item.fabric_site:
							# stock Entry to transfer material
							self.make_material_out_list(item, out_list)
							name = self.make_stock_transfer(item,out_list)
							self.Assign_FabricTo_ProcessAllotment(item)
						elif get_user_branch() != item.fabric_site:
							# generate Material Request
							name = make_material_request(item.sales_invoice_no, item.actual_site, item.fabric_site, item.fabric_code, item.fabric_qty)
							self.Assign_FabricTo_ProcessAllotment(item)
					if name:		
						self.submit_cut_order(item, name)
						msg_status = 'true'
					else:
						msg_status = 'false'
						return {"status": msg_status ,"msg":"Error !........"}
				else:
					return {"status": status ,"msg":msg}
		self.get_invoice_details()
		return {"status": msg_status ,"msg": msg}

	def validate_actual_qty(self, args):
		if args.actual_cut_qty:
			if flt(args.fabric_qty) < flt(args.actual_cut_qty):
				return "false", "Actual qty must be equal to fabric qty"
		else:
			return "false", "Mandatory Field Actual qty at row %s"%(args.idx)
		return "true",""

	def Assign_FabricTo_ProcessAllotment(self, args):
		name = 'Done'
		process_allotment = self.get_process_allotment(args)
		actual_cut_qty = flt(args.actual_cut_qty) / len(process_allotment)
		for process in process_allotment:
			obj = frappe.get_doc('Process Allotment', process[0])
			if process_allotment:
				rm = obj.append('issue_raw_material',{})
				rm.raw_material_item_code = args.fabric_code
				rm.raw_material_item_name = frappe.db.get_value('Item', args.fabric_code, 'item_name')
				rm.raw_sub_group = frappe.db.get_value('Item', args.fabric_code, 'item_sub_group')
				rm.uom = frappe.db.get_value('Item', args.fabric_code, 'stock_uom')
				rm.qty = cstr(actual_cut_qty)
				obj.save(ignore_permissions = True)
				name = obj.name
		return name

	def get_process_allotment(self, args):
		process = frappe.db.sql(""" select distinct a.process_data from `tabProcess Log` a, `tabProduction Dashboard Details` b
			where a.parent = b.name and b.article_code='%s' and b.sales_invoice_no = '%s'
			and a.actual_fabric = 1"""%(args.article_code, args.invoice_no), as_list=1)
		if process:
			return process
		else:
			return frappe.db.get_value('Process Allotment', {'sales_invoice_no': args.invoice_no}, 'name', as_list=1)

	def make_material_issue_list(self, item, issue_list):
		if item.actual_cut_qty:
			data = frappe.db.sql("""select * from `tabProcess Allotment` where
			 item = '%s' and sales_invoice_no = '%s' and process = 'Stiching'""")
		else:
			frappe.msgprint("Enter Actual Qty for Cut Order")

	def make_material_out_list(self, item, out_list):
		out_list.append([item.invoice_no, item.article_code, 
				item.fabric_code, item.fabric_qty, 
				item.actual_site, item.fabric_site])

	def make_stock_transfer(self, item, out_list):
		name = frappe.db.sql(""" select distinct a.parent from `tabStock Entry Detail` a, `tabStock Entry` b
			where a.target_branch = '%s' and a.parent=b.name and b.docstatus=0"""%(item.actual_site), as_list=1)
		if name:
			obj = frappe.get_doc('Stock Entry', name[0][0])
			self.Make_ChildSte(obj, out_list)
			obj.posting_date = nowdate()
			obj.posting_time = nowtime()
			obj.save(ignore_permissions = True)
			return obj.name
		else:
			name = self.make_parentSTE(item, out_list)
			return name

	def make_parentSTE(self, item, out_list):
		se = frappe.new_doc('Stock Entry')
		se.naming_series =  get_series("Stock Entry")
		se.purpose_type = 'Material Out'
		se.purpose = 'Material Issue'
		se.from_warehouse = get_branch_warehouse(item.fabric_site)
		se.t_branch = item.actual_site
		se.branch = frappe.db.get_value('User', frappe.session.user, 'branch')
		se.posting_date = nowdate()
		se.posting_time = nowtime().split('.')[0]
		self.Make_ChildSte(se, out_list)
		se.save(ignore_permissions = True)
		return se.name

	def Make_ChildSte(self, obj, out_list):
		for item in out_list:
			incoming_rate_args = self.get_args_list(item[2], get_warehouse(item[5]), cint(item[3]), '')
			fab_details = get_fabric_details(item[2])
			sed = obj.append('mtn_details', {})
			sed.invoice_no = item[0]
			sed.s_warehouse = get_warehouse(item[5])
			sed.target_branch = item[4]
			sed.t_warehouse = get_branch_warehouse(sed.target_branch)
			sed.item_code = item[2]
			sed.item_name = fab_details.get('item_name')
			sed.description = fab_details.get('description')
			sed.qty = cint(item[3])
			sed.stock_uom = fab_details.get('stock_uom')
			sed.uom = fab_details.get('stock_uom')
			sed.conversion_factor = 1
			sed.incoming_rate = get_incoming_rate(incoming_rate_args) or 1.0
			sed.transfet_qty = cint(item[3]) * 1
			company = frappe.db.get_value('Global Defaults', None, 'default_company')
			sed.expense_account = frappe.db.get_value('Company', company, 'default_expense_account') or 'Stock Adjustment - '+frappe.db.get_value('Company', company, 'abbr')
			sed.cost_center = get_branch_cost_center(get_user_branch()) or 'Main - '+frappe.db.get_value('Company', company, 'abbr')
		return "Done"

	def get_args_list(self, item_code, warehouse, qty, sn_list):
		return	frappe._dict({
					"item_code": item_code,
					"warehouse": warehouse,
					"posting_date": nowdate(),
					"posting_time": nowtime(),
					"qty": qty,
					"serial_no": sn_list
				})

	def update_fabric_stock(self, issue_list):pass

	def submit_cut_order(self, item, name):
		co = frappe.get_doc('Cut Order', item.cut_order_id)
		co.submit()
		frappe.db.sql(""" update `tabFabric Reserve` set qty='%s', article_serial_no='%s' where invoice_no='%s'
			and article_code = '%s' and 
			fabric_code='%s'"""%(item.actual_cut_qty, name, item.invoice_no, item.article_code, item.fabric_code))