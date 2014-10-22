frappe.pages['sales-dashboard'].onload = function(wrapper) {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Sales Dashboard',
		single_column: true
	});
	console.log($(this))
	$(wrapper).find(".layout-main").html("<div class='user-settings'></div>\
	<table width = '100%'>\
		<tr><td width = '40%' bgcolor = '#F2F0F0' style='padding:0; margin:0;border-spacing: 0;'><div id= 'customer' width='100%'></div></td>\
			<td width = '60%' rowspan='2' valign='top'><div id= 'result_area' style ='height:500px;overflow-y:auto;'width='100%' ></div></td>\
		</tr>\
		<tr><td width = '40%' bgcolor = '#F2F0F0' style='z-index: -1;'><div id= 'sales_invoice'></td></tr>\
	</table>");
	new frappe.SalesDashboard(wrapper);
}

frappe.SalesDashboard =  Class.extend({
	init: function(wrapper) {
		this.wrapper = wrapper;
		this.body = $(this.wrapper).find(".user-settings");
		this.render_customer();
		this.render_sales_invoice()
	},
	render_customer: function(){
		new frappe.Customer(this.wrapper)
	},
	render_sales_invoice: function(){
		new frappe.SalesInvoce(this.wrapper)
	}
})

frappe.Customer = Class.extend({
	init: function(wrapper, search_key){
		this.wrapper = wrapper;
		this.search_key = search_key;
		$(this.wrapper).find('#customer').empty()
		$(this.wrapper).find('#customer').html("<h3>1. Customer Details</h3>")
		new frappe.SearchArea(this.wrapper, $(this.wrapper).find('#customer'), search_key)
		this.get_customer_list()
	},
	get_customer_list: function(){
		var me = this;
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_customer_list",
			args:{'search_key': this.search_key},
			callback: function(r){
				me.render_customer_list(r.message)
				// new frappe.SalesInvoce(me.wrapper,me.search_key)
			}
		})
	},
	render_customer_list: function(customers_list){
		var me = this;
		this.customer_tab = $(this.wrapper).find('#customer');
		columns = [[frappe._("Customer Name"), 100]];

		this.table = $("<table class='table table-bordered' style='height:50px;'>\
			<thead><tr></tr></thead>\
			<tbody style='display: block;height:150px;overflow-y: auto;'></tbody>\
		</table>").appendTo(this.customer_tab);

		$.each(columns, 
			function(i, col) {
			$("<th>").html(col[0]).css("width", col[1]+"%").css("allign","center")
				.appendTo(me.table.find("thead tr"));
		});

		$.each(customers_list, 
			function(i, cust) {
			var row = $("<tr id="+i+">").appendTo(me.table.find("tbody"));
			$("<td>").html(cust[0]).appendTo(row).click(function(){
				$('.bold').removeClass('bold'); // deselect
				$(this).addClass('bold');
				new frappe.CustomerForm(me.wrapper, 'open', $(this).text())
				new frappe.SalesInvoce(me.wrapper,$(this).text())
			})
		});
	}
})

frappe.SalesInvoce = Class.extend({
	init: function(wrapper, search_key){
		this.wrapper = wrapper;
		this.search_key = search_key;
		$(this.wrapper).find('#sales_invoice').empty()
		$(this.wrapper).find("#sales_invoice").html("<h3>2. Sales Invoice Details</h3>")
		new frappe.SearchArea(this.wrapper, $(this.wrapper).find('#sales_invoice'), search_key)
		this.get_si_list()
	},
	get_si_list: function(){
		var me = this;
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_si_list",
			args:{'search_key': this.search_key},
			callback: function(r){
				me.render_si_list(r.message)
			}
		})	
	},
	render_si_list: function(si_list){
		var me = this;
		this.si_tab = $(this.wrapper).find('#sales_invoice');

		columns = [[frappe._("Salse Invoice"), 100]];

		this.table = $("<table class='table table-bordered'>\
			<thead><tr></tr></thead>\
			<tbody style='display: block;height:150px;overflow-y: auto;'></tbody>\
		</table>").appendTo(this.si_tab);

		$.each(columns, 
			function(i, col) {
			$("<th>").html(col[0]).css("width", col[1]+"%").css("align","center")
				.appendTo(me.table.find("thead tr"));
		});

		$.each(si_list, 
			function(i, si) {
			var row = $("<tr id="+i+">").appendTo(me.table.find("tbody"));
			$("<td>").html('<a href="#Form/Sales Invoice/'+si[0]+'">'
				+si[0]+'</a>').appendTo(row);

		});
	}
})

frappe.SearchArea = Class.extend({
	init:function(wrapper, area, search_key){
		this.wrapper = wrapper;
		this.area = area
		this.search_key = search_key
		this.render_search_area()
	},
	render_search_area: function(){
		var me = this;
		var row = $("<tr>").appendTo(this.area);
		$('<td>').html('<input class="form-control" \
			placeholder="Search Area">').appendTo(row);

		$(me.area).find('.form-control').val(this.search_key)

		$("<button class='btn btn-small btn-default'><i class='icon-search'></i></button>")
			.appendTo($("<td>").appendTo(row))
			.click(function() {
				if($(me.area).attr('id') == 'customer')
					new frappe.Customer(me.wrapper, $(me.area).find('.form-control').val())
				if($(me.area).attr('id') == 'sales_invoice')
					new frappe.SalesInvoce(me.wrapper, $(me.area).find('.form-control').val())
			});

		$("<button class='btn btn-small btn-default'><i class='icon-plus'></i></button>")
			.appendTo($("<td>").appendTo(row))
			.click(function() {
				new frappe.CustomerForm(me.wrapper, 'new')
			});
	}

})

frappe.CustomerForm = Class.extend({
	init: function(wrapper, form_type, customer){
		this.wrapper = wrapper;

		this.field_list = [['Full Name', 'Data', '','customer_name'], 
			['Customer Group', 'Link', 'Customer Group', 'customer_group'], 
			['Type','Select','\nCompany\nIndividual','customer_type'], 
			['Territory', 'Link', 'Territory', 'territory'], 
			['Address Line 1', 'Data', '', 'address_line1'], 
			['Address Line 2', 'Data', '', 'address_line2'], 
			['City', 'Data', '', 'city'], 
			['Mobile', 'Data', '', 'mobile_no'], 
			['Landline Number','Data', '', 'phone'], 
			['Email Id','Data', '', 'email_id'], 
			['Designation', 'Data', '', 'designation'], 
			['Date of Birth','Date', '', 'date_of_birth'], 
			['Anniversary Date', 'Date', '', 'anniversary_date']];

		this.field_list = [['Customer', 'Data', '','customer'], 
			['Currency', 'Link', 'Currency', 'currency'], 
			['Delivery Date','Date','','delivery_date'], 
			['Book Date', 'Date', '', 'posting_date'], 
			['Delivery Branch', 'Link', '', 'Branch'], 
			['Address Line 2', 'Data', '', 'address_line2'], 
			['City', 'Data', '', 'city'], 
			['Mobile', 'Data', '', 'mobile_no'], 
			['Landline Number','Data', '', 'phone'], 
			['Email Id','Data', '', 'email_id'], 
			['Designation', 'Data', '', 'designation'], 
			['Date of Birth','Date', '', 'date_of_birth'], 
			['Anniversary Date', 'Date', '', 'anniversary_date']];
		
		if(form_type == 'new')
			this.render_customer_form(form_type);

		if(form_type == 'open')
			this.open_record(customer);

	},
	render_customer_form: function(form_type){
		var me = this;
		$('#result_area').empty()
		this.field_area = $(this.wrapper).find('#result_area')
		this.table = $("<table>\
			<tbody></tbody>\
		</table>").appendTo(this.field_area);

		$.each(this.field_list, 
			function(i, field) {
				var row = $("<tr>").appendTo(me.table.find("tbody"));
				$('<td width="20%">').html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%">'+field[0]+'</label>').appendTo(row);
				var td = $("<td>").appendTo(row)
				frappe.ui.form.make_control({
					df: {
					    "fieldtype": field[1],
						"fieldname": field[3],
						"options": field[2],
						"label": field[0]
						},
					parent:td,
				}).make_input();
			}
		)
		
		var row = $("<tr>").appendTo(me.table.find("tbody"));
		if(form_type == 'new'){
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
			.click(function() {
				me.create_customer()
			});
		}
		else{
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-folder-open'></i></button>")
			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
			.click(function() {
				window.open("#Form/Customer/"+$('[data-fieldname="customer_name"]').val(), "_self");
			});
		}

		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%")
	},
	create_customer: function(){
		var me = this;
		this.cust_details = {};
		$.each(this.field_list, function(i, field) {
			me.cust_details[field[3]] = $('[data-fieldname="'+field[3]+'"]').val()
		})
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.create_customer",
			args:{'cust_details': this.cust_details},
			callback: function(r){
				new frappe.Customer(me.wrapper)
			}
		})	
	},
	open_record: function(customer){
		var me = this;
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_cust_details",
			args:{'customer': customer},
			callback: function(r){
				me.render_customer_form()
				$.each(r.message, function(key, val){
					$('[data-fieldname="'+key+'"]').attr("disabled","disabled")
					$('[data-fieldname="'+key+'"]').attr("value", val)
				})
			}
		})	
	}

})


frappe.CustomerForm = Class.extend({
	init: function(wrapper, form_type, customer){
		this.wrapper = wrapper;

		this.field_list = [['Customer', 'Link', 'Customer','customer'], 
			['Currency', 'Link', 'Currency', 'currency'], 
			['Delivery Date','Date','','delivery_date'], 
			['Book Date', 'Date', '', 'posting_date'], 
			['Delivery Branch', 'Link', '', 'Branch'], 
			['Address Line 2', 'Data', '', 'address_line2'], 
			['City', 'Data', '', 'city'], 
			['Mobile', 'Data', '', 'mobile_no'], 
			['Landline Number','Data', '', 'phone'], 
			['Email Id','Data', '', 'email_id'], 
			['Designation', 'Data', '', 'designation'], 
			['Date of Birth','Date', '', 'date_of_birth'], 
			['Anniversary Date', 'Date', '', 'anniversary_date']];
		
		if(form_type == 'new')
			this.render_customer_form(form_type);

		if(form_type == 'open')
			this.open_record(customer);

	},
	render_customer_form: function(form_type){
		var me = this;
		$('#result_area').empty()
		this.field_area = $(this.wrapper).find('#result_area')
		this.table = $("<table>\
			<tbody></tbody>\
		</table>").appendTo(this.field_area);

		$.each(this.field_list, 
			function(i, field) {
				var row = $("<tr>").appendTo(me.table.find("tbody"));
				$('<td width="20%">').html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%">'+field[0]+'</label>').appendTo(row);
				var td = $("<td>").appendTo(row)
				frappe.ui.form.make_control({
					df: {
					    "fieldtype": field[1],
						"fieldname": field[3],
						"options": field[2],
						"label": field[0]
						},
					parent:td,
				}).make_input();
			}
		)
		
		var row = $("<tr>").appendTo(me.table.find("tbody"));
		if(form_type == 'new'){
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
			.click(function() {
				me.create_customer()
			});
		}
		else{
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-folder-open'></i></button>")
			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
			.click(function() {
				window.open("#Form/Customer/"+$('[data-fieldname="customer_name"]').val(), "_self");
			});
		}

		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%")
	},
	create_customer: function(){
		var me = this;
		this.cust_details = {};
		$.each(this.field_list, function(i, field) {
			me.cust_details[field[3]] = $('[data-fieldname="'+field[3]+'"]').val()
		})
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.create_customer",
			args:{'cust_details': this.cust_details},
			callback: function(r){
				new frappe.Customer(me.wrapper)
			}
		})	
	},
	open_record: function(customer){
		var me = this;
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_cust_details",
			args:{'customer': customer},
			callback: function(r){
				me.render_customer_form()
				$.each(r.message, function(key, val){
					$('[data-fieldname="'+key+'"]').attr("disabled","disabled")
					$('[data-fieldname="'+key+'"]').attr("value", val)
				})
			}
		})	
	}

})