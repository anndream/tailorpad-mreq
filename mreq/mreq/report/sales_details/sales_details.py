# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
	columns, data = [], []
	cond = "1=1"
	item_group = "item_group in('Tailoring', 'Merchandise', 'Fabric')"
	columns_data = "a.item_name, a.item_group, a.qty, a.amount"
	table = "Sales Invoice Item"
	if filters:
		if filters.get('branch'):
			cond = "b.branch='%s'"%(filters.get('branch'))
		if filters.get('item_group')!='All':
			columns_data, item_group, table  = get_invoice_detail(filters.get('item_group'))

	data = frappe.db.sql("""select a.parent, %s, b.branch 
		from `tab%s`a, `tabSales Invoice` b where a.parent = b.name and %s and %s and b.docstatus = 1"""%(columns_data, table, cond, item_group), as_list=1)

	columns = ["Sales Invoice:Link/Sales Invoice:150", "Item Name::110","Item Group::100","Qty::50", "Amount:Currency:100","Branch:Link/Branch:150"]
	return columns, data


def get_invoice_detail(item_group):
	if item_group == 'Tailoring':
		return "a.tailoring_item_name, a.tailoring_item_group, a.tailoring_qty, a.tailoring_amount", "a.tailoring_item_group= 'Tailoring' ", "Sales Invoice Items"
	elif item_group == 'Merchandise':
		return "a.merchandise_item_name, a.merchandise_item_group, a.merchandise_qty, a.merchandise_amount", "a.merchandise_item_group = 'Merchandise'", "Merchandise Items"
	elif item_group == 'Fabric':
		return "a.merchandise_item_name, a.merchandise_item_group, a.merchandise_qty, a.merchandise_amount", "a.merchandise_item_group = 'Fabric'", "Merchandise Items"