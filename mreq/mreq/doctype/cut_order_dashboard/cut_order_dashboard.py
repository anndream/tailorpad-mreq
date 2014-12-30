# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import cint, nowtime, nowdate
from frappe.model.document import Document
from tools.tools_management.custom_methods import get_fabric_details, get_warehouse, get_branch, get_series, get_fabric_details
from tools.custom_data_methods import get_user_branch, get_branch_cost_center, get_branch_warehouse, update_serial_no, find_next_process

class CutOrderDashboard(Document):
	def get_invoice_details(self):
		self.set('cut_order_item', [])
		for co in self.get_cut_order_details():
			coi = self.append('cut_order_item', {})
			coi.invoice_no = co['invoice_no']
			coi.article_code = co['article_code']
			coi.fabric_code = co['fabric_code']
			coi.fabric_qty = co['qty']
			coi.actual_site = co['actual_site']
			coi.fabric_site = co['fabric_site']
			coi.cut_order_id = co['name']

	def get_cut_order_details(self):
		branch = get_user_branch()
		cond = "1=1"
		if branch:
			cond = "fabric_site = '%s'"%(branch)
		return frappe.db.sql("""select invoice_no, article_code, 
				fabric_code, qty, 
				article_serial_no, 
				actual_site, fabric_site, name from `tabCut Order` 
			where ifnull(docstatus, 0) not in (1,2) and invoice_no in 
			(select name from `tabSales Invoice` where branch=%s) order by invoice_no desc"""%(cond), as_dict=1)

	def cut_order(self):
		issue_list, out_list = [], []
		for item in self.cut_order_item:
			if cint(item.select) == 1:
				if item.actual_site == item.fabric_site:
					self.Assign_FabricTo_ProcessAllotment(item)
				else:
					if get_user_branch() == item.fabric_site:
						self.make_material_out_list(item, out_list)
						self.make_stock_transfer(item,out_list)
					elif get_user_branch() != item.fabric_site:
						pass #Remaining
				self.submit_cut_order(item)
		# self.update_fabric_stock(issue_list)
		# self.get_invoice_details()

	def Assign_FabricTo_ProcessAllotment(self, args):
		process_allotment = self.get_process_allotment(args)
		obj = frappe.get_doc('Process Allotment', process_allotment)
		if process_allotment:
			rm = obj.append('issue_raw_material',{})
			rm.raw_material_item_code = args.fabric_code
			rm.raw_material_item_name = frappe.db.get_value('Item', args.fabric_code, 'item_name')
			rm.raw_sub_group = frappe.db.get_value('Item', args.fabric_code, 'item_sub_group')
			rm.uom = frappe.db.get_value('Item', args.fabric_code, 'stock_uom')
			rm.qty =  args.actual_cut_qty
			rm.save(ignore_permissions = True)
		return True

	def get_process_allotment(self, args):
		process = frappe.db.sql(""" select process_name from `tabProcess Item` 
			where parent='%s' and actual_fabric = 1 order by idx limit 1"""%(args.article_code), )
		if process:
			return process[0][0]
		return None

	def make_material_issue_list(self, item, issue_list):
		if item.actual_cut_qty:
			data = frappe.db.sql("""select * from `tabProcess Allotment` where
			 item = '%s' and sales_invoice_no = '%s' and process = 'Stiching'""")

		else:
			frappe.msgprint("Enter Actual Qty for Cut Order")
		# frappe.errprint(item.invoice_no)
		# issue_list.append([item.invoice_no, item.article_code, 
		# 		item.fabric_code, item.fabric_qty, 
		# 		item.actual_site, item.fabric_site])


	def make_material_out_list(self, item, out_list):
		out_list.append([item.invoice_no, item.article_code, 
				item.fabric_code, item.fabric_qty, 
				item.actual_site, item.fabric_site])

	def make_stock_transfer(self, item, out_list):
		name = frappe.db.sql(""" select a.distinct parent from `tabStock Entry Detail` a, `tabStock Entry` b
			where a.target_branch = '%s' and a.parent=b.name and b.docstatus=0"""%(item.actual_site), as_list=1)
		if name:
			obj = frappe.get_doc('Stock Entry', name[0][0])
			self.Make_ChildSte(obj, out_list)
			obj.save(ignore_permissions = True)	
		else:
			self.make_parentSTE(item, out_list)

	def make_parentSTE(self, item, out_list):
		se = frappe.new_doc('Stock Entry')
		se.naming_series =  get_series("Stock Entry")
		se.purpose_type = 'Material Out'
		se.purpose = 'Material Issue'
		se.branch = frappe.db.get_value('User', frappe.session.user, 'branch')
		se.posting_date = nowdate()
		se.posting_time = nowtime().split('.')[0]
		self.Make_ChildSte(se, out_list)
		se.save(ignore_permissions = True)

	def Make_ChildSte(self, obj, out_list):
		for item in out_list:
			fab_details = get_fabric_details(item[2])
			sed = obj.append('mtn_details', {})
			sed.invoice_no = item[0]
			sed.s_warehouse = get_warehouse(item[4])
			sed.target_branch = get_branch(item[5])
			sed.item_code = item[2]
			sed.item_name = fab_details.get('item_name')
			sed.description = fab_details.get('description')
			sed.qty = cint(item[3])
			sed.stock_uom = fab_details.get('stock_uom')
			sed.uom = fab_details.get('stock_uom')
			sed.conversion_factor = 1
			sed.incoming_rate = 1.0
			sed.transfet_qty = cint(item[3]) * 1
			company = frappe.db.get_value('Global Defaults', None, 'default_company')
			sed.expense_account = frappe.db.get_value('Company', company, 'default_expense_account') or 'Stock Adjustment - '+frappe.db.get_value('Company', company, 'abbr')
			sed.cost_center = get_branch_cost_center(get_user_branch()) or 'Main - '+frappe.db.get_value('Company', company, 'abbr')
		return "Done"

	def update_fabric_stock(self, issue_list):pass

	def submit_cut_order(self, item):
		co = frappe.get_doc('Cut Order', item.cut_order_id)
		co.submit()