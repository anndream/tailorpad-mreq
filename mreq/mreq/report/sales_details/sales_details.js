// Copyright (c) 2013, IndictransTech and contributors
// For license information, please see license.txt
alert(window.branch_name)
frappe.query_reports["Sales Details"] = {
	"filters": [
		{
			"fieldname":"branch",
			"label": __("Branch"),
			"fieldtype": "Link",
			"options": "Branch",
			"default": window.branch_name || ''
		},
		{
			"fieldname":"item_group",
			"label": __("Item Group"),
			"fieldtype": "Link",
			"options" : "Item Group",
			"default": window.item_group || ''
		}
	]
}

