// Copyright (c) 2013, IndictransTech and contributors
// For license information, please see license.txt

frappe.query_reports["Sales Details"] = {
	"filters": [
		{
			"fieldname":"branch",
			"label": __("Branch"),
			"fieldtype": "Link",
			"options": "Branch"
		},
		{
			"fieldname":"item_group",
			"label": __("Item Group"),
			"fieldtype": "Select",
			"options" : "All\nTailoring\nMerchandise\nFabric"
		}
	]
}

