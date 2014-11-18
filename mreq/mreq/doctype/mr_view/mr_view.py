# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import cint
from tools.tools_management.custom_methods import make_cut_order, make_stock_transfer

class MRView(Document):
	def onload(self):
		frappe.errprint(frappe.session.get('user'))
		self.get_raised_by()
		self.get_req_by()

	def get_raised_by(self):
		frappe.errprint(['Print ', frappe.session.user])
		raised_by = frappe.db.sql("""select mr.name,  mri.name as mri_name, mri.item_code, mri.item_name, mri.description, mri.item_group, mri.uom, mri.qty, mri.for_branch, mri.from_branch, mri.warehouse, mri.from_warehouse 
			from `tabMaterial Request` mr, `tabMaterial Request Item` mri, `tabUser` u
			where mr.name = mri.parent and mri.for_branch = u.branch and u.name = 'Administrator' """, as_dict=1, debug=1)
		frappe.errprint(raised_by)
		self.set('raised_by', [])	
		
		for mr in raised_by:
			rb = self.append('raised_by', {})
			rb.material_request = mr.name
			rb.mri_name = mr.mri_name
			rb.item = mr.item_code
			rb.item_name = mr.item_name
			rb.description = mr.description
			rb.item_group = mr.item_group
			rb.uom = mr.uom
			rb.qty = mr.qty
			rb.for_branch = mr.for_branch
			rb.from_branch = mr.from_branch
			rb.for_warehouse = mr.warehouse
			rb.from_warehouse = mr.from_warehouse

	def get_req_by(self):
		req_by = frappe.db.sql("""select mr.name,  mri.name as mri_name, mri.item_code, mri.item_name, mri.description, mri.item_group, mri.uom, mri.qty, mri.for_branch, mri.from_branch, mri.warehouse, mri.from_warehouse, mri.invoice_no 
			from `tabMaterial Request` mr, `tabMaterial Request Item` mri, `tabUser` u
			where mr.name = mri.parent and mri.from_branch = u.branch and u.name = 'Administrator'""", as_dict=1, debug=1)

		self.set('request_for', [])
		for mr in req_by:
			rb = self.append('request_for', {})
			rb.material_request = mr.name
			rb.invoice_no = mr.invoice_no
			rb.mri_name = mr.mri_name
			rb.item = mr.item_code
			rb.item_name = mr.item_name
			rb.description = mr.description
			rb.item_group = mr.item_group
			rb.uom = mr.uom
			rb.qty = mr.qty
			rb.for_branch = mr.for_branch
			rb.from_branch = mr.from_branch
			rb.for_warehouse = mr.warehouse
			rb.from_warehouse = mr.from_warehouse

	def create_co(self):
		for item in self.get('request_for'):
			if cint(item.rf_check) == 1 and  item.item_group =='Fabric':
				make_cut_order(id, {'name':item.invoice_no}, item.for_branch, item.from_branch, [item.item, item.qty, ''], 1)
				item.co = 'Yes'
				make_stock_transfer(item.for_branch, item.from_branch, item.item, item.qty)
				self.update_material_request(item.material_request, item.item)
				frappe.msgprint("Stock Entry for cutted fabric has drafted")
				self.onload()

	def update_material_request(self, mr_no, item):
		frappe.db.sql("""update `tabMaterial Request Item` set co = 'Yes' where item_code = '%s' and parent = '%s' """%(mr_no, item))
		frappe.db.commit()
