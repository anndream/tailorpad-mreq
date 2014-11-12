# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
	columns, data = [], []
	cond = "1=1"
	if filters:
		cond = "sales_invoice_branch='%s'"%(filters.get('branch'))
	data = frappe.db.sql("""select parent, amount, item_group, sales_invoice_branch 
		from `tabSales Invoice Item` where %s"""%(cond), as_list=1)
	columns = ["Sales Invoice:Link/Sales Invoice:150", "Amount:Currency:60","Item Group:Link/Item Group:60","Branch:Link/Branch:50"]
	return columns, data