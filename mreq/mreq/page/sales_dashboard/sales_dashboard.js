frappe.pages['sales-dashboard'].onload = function(wrapper) {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Sales Dashboard',
		single_column: true
	});
	new frappe.SalesDashboard(wrapper)
}

frappe.SalesDashboard = Class.extend({
	init: function(wrapper){
		this.form_wrapper = $('<div width ="100%"><div id ="left_menu"></div><div id="main_body"></div></div>').appendTo($(wrapper).find('.layout-main'))
	},
	
})