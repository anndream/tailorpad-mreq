# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Service(Document):
	def onload(self):
		if not self.currency:
			self.currency = frappe.db.get_value('Global Defaults', None, 'default_currency')

	def validate(self):
		if self.get("__islocal"):
			if not frappe.db.get_value('Price List', self.service, 'name'):
				pl = frappe.new_doc('Price List')
				pl.price_list_name = self.service
				pl.selling = 1
				pl.currency = self.currency
				self.add_value_for_territory(pl)
				pl.save(ignore_permissions = True)

	def add_value_for_territory(self, obj):
		tr = obj.append('valid_for_territories',{})
		tr.territory = 'All Territories'
		return obj