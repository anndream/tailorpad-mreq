from frappe import _

def get_data():
	return [
		{
			"label": _("Documents"),
			"icon": "icon-star",
			"items": [
				{
					"type": "doctype",
					"name": "MR View",
					"label": _("Material Request Dashboard"),
					"description": _("View Invoices"),
				},
				{
					"type": "doctype",
					"label": _("Cashier Dashboard"),
					"name": "Cashier Dashboard",
					"icon": "icon-dashboard",
					"description": _("Cashier Dashboard"),
				},
				{
					"type": "doctype",
					"name": "Cut Order Dashboard",
					"label": _("Cut Order Dashboard"),
					"description": _("Cut Order Dashboard"),
				},
				{
					"type": "doctype",
					"name": "Purchase Order",
					"label": _("Purchase Order"),
					"description": _("Paid Entries"),
				},
				{
					"type": "doctype",
					"name": "Material Request",
					"label": _("Material Request"),
					"description": _("All types of material request"),
				},
				{
					"type": "doctype",
					"name": "Stock Entry",
					"label": _("Stock Entry"),
					"description": _("All types of stock entry"),
				},
			]
		},

		
	]
