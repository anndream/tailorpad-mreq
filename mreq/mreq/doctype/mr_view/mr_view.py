# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class MRView(Document):
	def onload(self):
		frappe.errprint(frappe.session.get('user'))
		self.get_raised_by()
		self.get_req_by()

	def get_raised_by(self):
		frappe.errprint(['Print ', frappe.session.user])
		raised_by = frappe.db.sql("""select mr.name,  mri.name as mri_name, mri.item_code, mri.item_name, mri.description, mri.uom, mri.qty, mri.warehouse, mri.from_warehouse 
			from `tabMaterial Request` mr, `tabMaterial Request Item` mri
			where mr.name = mri.parent and mri.warehouse in (select warehouse from tabBranch 
				where branch = (select branch from tabEmployee where user_id = 'Administrator')) """, as_dict=1, debug=1)
		frappe.errprint(raised_by)
		self.set('raised_by', [])	
		
		for mr in raised_by:
			rb = self.append('raised_by', {})
			rb.material_request = mr.name
			rb.mri_name = mr.mri_name
			rb.item = mr.item_code
			rb.item_name = mr.item_name
			rb.description = mr.description
			rb.uom = mr.uom
			rb.qty = mr.qty
			rb.for_warehouse = mr.warehouse
			rb.from_warehouse = mr.from_warehouse

	def get_req_by(self):
		req_by = frappe.db.sql("""select mr.name, mri.item_code,  mri.item_name, mri.description, mri.uom, mri.qty, mri.warehouse, mri.from_warehouse 
			from `tabMaterial Request` mr, `tabMaterial Request Item` mri
			where mr.name = mri.parent and mri.from_warehouse in (select warehouse from tabBranch 
				where branch = (select branch from tabEmployee where user_id = 'Administrator')) """, as_dict=1, debug=1)

		self.set('request_for', [])
		for mr in req_by:
			rb = self.append('request_for', {})
			rb.material_request = mr.name
			rb.item = mr.item_code
			rb.item_name = mr.item_name
			rb.description = mr.description
			rb.uom = mr.uom
			rb.qty = mr.qty
			rb.for_warehouse = mr.warehouse
			rb.from_warehouse = mr.from_warehouse