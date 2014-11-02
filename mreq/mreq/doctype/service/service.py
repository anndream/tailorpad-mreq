# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Service(Document):
	def validate(self):
		if self.get("__islocal"):
			pl = frappe.new_doc('Price List')
			pl.price_list_name = self.service
			pl.selling = 1
			self.add_value_for_territory(pl)
			pl.save(ignore_permissions = True)

	def add_value_for_territory(self, obj):
		tr = obj.append('valid_for_territories',{})
		tr.territory = 'All Territories'
		return obj