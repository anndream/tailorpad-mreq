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
			<td width = '60%' rowspan='2' valign='top'><div id= 'result_area' style ='height:600px;width:600px;overflow-y:auto;'  ></div></td>\
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
			$("<td>").html(si[0]).appendTo(row).click(function(){
				$('.bold').removeClass('bold'); // deselect
				$(this).addClass('bold');
				me.add_worklist($(this).text(), this)
				new frappe.SalesForm(me.wrapper, 'open', $(this).text())
			})

		});
	},
	add_worklist:function(si_num, td){
		console.log(['test', si_num])
		var me = this;
		this.si_td = td;
		$('#wo').remove()
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_work_orders",
			args:{'si_num': si_num},
			callback:function(r){
				$('<div id="wo"></div>').appendTo($(me.si_td))
				$.each(r.message, function(i, workorder){
					$('#wo').append('<div style="margin-left:2%;display:inline;">\
								<span><i class="icon-long-arrow-right"></i>\
								</span>'+workorder+' </div>').click(function(){
									new frappe.WOForm(me.wrapper, $(this).text())
								});
				})
			}
		})
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
				if($(me.area).attr('id') == 'customer')
					new frappe.CustomerForm(me.wrapper, 'new')
				if($(me.area).attr('id') == 'sales_invoice')
					new frappe.SalesForm(me.wrapper, 'new')
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


frappe.SalesForm = Class.extend({
	init: function(wrapper, form_type, customer){
		this.wrapper = wrapper;

		this.field_list = {
			'Basic Info':[['Customer', 'Link', 'Customer','customer'],
				['Currency', 'Link', 'Currency', 'currency'], 
				['Delivery Date','Date','','delivery_date'], 
				['Book Date', 'Date', '', 'posting_date'], 
				['Delivery Branch', 'Link', 'Branches', 'branch']],
			'Tailoring Item Details':[
				['Price List', 'Link', 'Price List','tailoring_price_list'], 
				['Item Code', 'Link', 'Item','tailoring_item_code'], 
				['Fabric Code', 'Link', 'Item','fabric_code'],
				['Size', 'Link', 'Size','tailoring_size'],
				['Width', 'Link', 'Width','width'],
				['Fabric Qty', 'Data', '','fabric_qty'],
				['Qty', 'Data', '','tailoring_qty'],
				['Rate', 'Data', '','tailoring_rate'],
				['Split Qty', 'Button', '', 'split_qty']],
			'Merchandise Item Details':[
				['Price List', 'Link', 'Price List','merchandise_price_list'], 
				['Item Code', 'Link', 'Item','merchandise_item_code'], 
				['Qty', 'Data', '','merchandise_qty'],
				['Rate', 'Data', '','merchandise_rate']]
		};
		
		if(form_type == 'new')
			this.render_sales_form(form_type);

		if(form_type == 'open')
			this.open_record(customer);

	},
	render_sales_form: function(form_type){
		var me = this;
		$('#result_area').empty()
		this.field_area = $(this.wrapper).find('#result_area')

		$.each(this.field_list, 
			function(i, field) {
				me.table1 = $("<table>\
						<tbody style='display: block;width:500px;'></tbody>\
						</table>").appendTo(me.field_area);
				me.render_child(field, form_type, i)

		})

		if(form_type == 'new'){
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
			.appendTo($("<td colspan='2' align='center'>").appendTo(me.field_area))
			.click(function() {
				me.create_si()
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
	render_child: function(fields, form_type, key){
		var me = this;

		$('<h4 class="col-md-12" style="margin: 0px 0px 15px;">\
			<i class="icon-in-circle icon-user"></i>\
			<span class="section-count-label"></span>.'+key+'. </h4>').prependTo(me.table1)

		var row = $("<tr>").appendTo(me.table1.find("tbody"));
		$.each(fields, 
			function(i, field) {
				$('<td>').html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%">'+field[0]+'</label>').appendTo(row);
				
				if(i%2 == 1){
					row = $("<tr>").appendTo(me.table1.find("tbody"));
					for(j=i-1; j<=(i); j++){
						var td = $("<td>").appendTo(row)
						frappe.ui.form.make_control({
							df: {
							    "fieldtype": fields[j][1],
								"fieldname": fields[j][3],
								"options": fields[j][2],
								"label": fields[j][0]
								},
							parent:td,
						}).make_input();

					}
					row = $("<tr>").appendTo(me.table1.find("tbody"));
				}
				else if(i == fields.length-1){
					row = $("<tr>").appendTo(me.table1.find("tbody"));
					var td = $("<td>").appendTo(row)
					frappe.ui.form.make_control({
							df: {
							    "fieldtype": fields[i][1],
								"fieldname": fields[i][3],
								"options": fields[i][2],
								"label": fields[i][0]
								},
							parent:td,
						}).make_input();
				}
			})

		$( "label" ).remove( ".col-xs-4" );
		$( "div.col-xs-8" ).addClass( "col-xs-12" )
		$( "div" ).removeClass( "col-xs-8" );
		$( "div.col-xs-12" ).css('padding','2%');

		$('[data-fieldname="tailoring_size"]').change(function(){
			frappe.call({
				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_size_and_rate",
				args:{'price_list': $('[data-fieldname="tailoring_price_list"]').val(), 
					'item_code':$('[data-fieldname="tailoring_item_code"]').val(),
					'fabric_code':$('[data-fieldname="fabric_code"]').val(),
					'branch':$('[data-fieldname="branch"]').val(),
					'size': $('[data-fieldname="tailoring_size"]').val()
					},
				callback: function(r){
					$('[data-fieldname="tailoring_rate"]').attr('value', r.message)
				}
			})
		})

		if(key!='Basic Info'){
			if(key == 'Tailoring Item Details')
				columns = [["Price List",50], ["Item Code", 100], ["Fabric Code", 100], ["Size", 100], ["Width", 100], ["Fabric Qty", 100], ["Qty", 100], ['Rate', 100]];
			if(key == 'Merchandise Item Details')
				columns = [["Price List",50], ["Item Code", 100], ["Qty", 100], ['Rate', 100]];

			if(form_type == 'new'){
				$("<button class='btn btn-small btn-primary' style='margin-bottom:2%' id='"+key+"'><i class='icon-plus'></i></button>")
				.appendTo($("<td colspan='2' align='center'>").appendTo(row))
				.click(function() {
					me.add_row($(this).attr('id'))
				});
			}

			this[key] =$("<table class='table table-bordered' id='sp'>\
				<thead><tr></tr></thead>\
				<tbody></tbody>\
			</table>").appendTo(me.field_area)

			$.each(columns, 
				function(i, col) {
				$("<th>").html(col[0]).css("width", col[1]+"px")
					.appendTo(me[key].find("thead tr"));
			});
		}
	},
	add_row:function(key){
		var me = this;
		this.tailoring_item_details = {};
		this.retrive_data(this.field_list[key])

		var row = $("<tr>").appendTo(me[key].find("tbody"));
		
		$.each(this.tailoring_item_details, function(i, d) {	
			$("<td>").html(d).appendTo(row);
		});
	},
	retrive_data: function(fields){
		var me = this;
		$.each(fields, function(i, field) {
			me.tailoring_item_details[field[3]] = $('[data-fieldname="'+field[3]+'"]').val()
		})	
	},
	create_si: function(){
		var me = this;
		this.invoce_details = {};
		$.each(this.field_list, function(tab_name, fields){
			if(tab_name != 'Basic Info'){
				var si_details_list = []
				me[tab_name].find('tr').each(function (tr_id, tr_val) {
					if(tr_id != 0){
						var $tds = $(this).find('td')
						var values = [];
						for(i=0; i< $tds.length; i++){
							values.push($tds.eq(i).text())
						}
						si_details_list.push(values)
					}	
				})
				me.invoce_details[tab_name] = si_details_list
			}
			else{
				var si_details_list = []
				$.each(fields, function(i, field) {
					si_details_list.push($('[data-fieldname="'+field[3]+'"]').val())
				})
				me.invoce_details[tab_name] = [si_details_list]
			}
		})
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.create_si",
			args:{'si_details': me.invoce_details, 'fields':me.field_list},
			callback: function(r){
				new frappe.SalesInvoce(me.wrapper)
			}
		})
	} 
})

frappe.WOForm = Class.extend({
	init: function(wrapper, woname){
		this.wrapper = wrapper;
		this.woname = woname;

		this.field_list = {
			"Work Order":[
					['Sales Invoice No','Link','Sales Invoice','sales_invoice_no'],
					['Item code', 'Link', 'Item', 'item_code'],
					['Customer Name', 'Data', '', 'customer_name'],
					['Serial NO', 'Small Text', '', 'serial_no_data']
				],
			"Style Transactions":[
					['Field Name', 'Link', 'Style', 'field_name']
				],
			"Measurement Transactions":[
					['Parameter', 'Link', 'Measurement', 'parameter'],
					['Abbreviation', 'Data', '', 'abbreviation'],
					['Value', 'Float', '', 'value']
				]
		}

		this.render_wo_form();
		
	},
	render_wo_form: function(){
		var me = this;
		$('#result_area').empty()
		this.field_area = $(this.wrapper).find('#result_area')

		$.each(this.field_list, 
			function(i, field) {
				console.log([i, field])
				me.table1 = $("<table>\
						<tbody style='display: block;width:500px;'></tbody>\
						</table>").appendTo(me.field_area);
				me.render_child(field, i)

		})

		$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-folder-open'></i></button>")
		.appendTo($("<td colspan='2' align='center'>").appendTo(row))
		.click(function() {
			window.open("#Form/Customer/"+$('[data-fieldname="customer_name"]').val(), "_self");
		});
	

		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%")
	},
	render_child: function(fields, key){
		var me = this;

		$('<h4 class="col-md-12" style="margin: 0px 0px 15px;">\
			<i class="icon-in-circle icon-user"></i>\
			<span class="section-count-label"></span>.'+key+'. </h4>').prependTo(me.table1)

		var row = $("<tr>").appendTo(me.table1.find("tbody"));
		$.each(fields, 
			function(i, field) {
				$('<td>').html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%">'+field[0]+'</label>').appendTo(row);
				
				if(i%2 == 1){
					row = $("<tr>").appendTo(me.table1.find("tbody"));
					for(j=i-1; j<=(i); j++){
						var td = $("<td>").appendTo(row)
						frappe.ui.form.make_control({
							df: {
							    "fieldtype": fields[j][1],
								"fieldname": fields[j][3],
								"options": fields[j][2],
								"label": fields[j][0]
								},
							parent:td,
						}).make_input();

					}
					row = $("<tr>").appendTo(me.table1.find("tbody"));
				}
				else if(i == fields.length-1){
					row = $("<tr>").appendTo(me.table1.find("tbody"));
					var td = $("<td>").appendTo(row)
					frappe.ui.form.make_control({
							df: {
							    "fieldtype": fields[i][1],
								"fieldname": fields[i][3],
								"options": fields[i][2],
								"label": fields[i][0]
								},
							parent:td,
						}).make_input();
				}
			})

		$( "label" ).remove( ".col-xs-4" );
		$( "div.col-xs-8" ).addClass( "col-xs-12" )
		$( "div" ).removeClass( "col-xs-8" );
		$( "div.col-xs-12" ).css('padding','2%');

		if(key!='Work Order'){

			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%' id='"+key+"'><i class='icon-plus'></i></button>")
			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
			.click(function() {
				me.add_row($(this).attr('id'))
			});

			if(key == 'Style Transactions')
				columns = [["Field Name",50], ["Name", 100], ["Abbreviation", 100], ['Image', 100],["View", 100]];
			if(key == 'Measurement Transactions')
				columns = [["Parameter",50], ["Abbreviation", 100], ["Value", 100]];

			this[key] =$("<table class='table table-bordered' id='sp'>\
				<thead><tr></tr></thead>\
				<tbody></tbody>\
			</table>").appendTo(me.field_area)

			$.each(columns, 
				function(i, col) {
				$("<th>").html(col[0]).css("width", col[1]+"px")
					.appendTo(me[key].find("thead tr"));
			});
		}

		this.render_data(key);
	},
	render_data: function(key){
		var me = this;
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_wo_details",
			args:{'tab': key, 'woname': this.woname},
			callback: function(r){
				console.log(r.message)
				$.each(r.message, function(i, d) {	
					var row = $("<tr>").appendTo(me[key].find("tbody"));
					$("<td>").html(d['field_name']).appendTo(row);
					$("<td>").html('<input type="Textbox" class="text_box">').appendTo(row);
					$("<td>").html(d['abbreviation']).appendTo(row);
					$("<td>").appendTo(row);
					$('<button  class="remove">View</button>').appendTo($("<td>")).appendTo(row)
						.click(function(){
							me.view_style($(this).closest("tr").find('td'), me[key].find("tbody"))
						});
				});
			}
		})
	},
    
	view_style:function(col_id, tab){
		// var e =locals[cdt][cdn]
		var style_name = $(col_id[0]).text();
		var image_data;
		var dialog = new frappe.ui.Dialog({
				title:__(style_name+' Styles'),
				fields: [
					{fieldtype:'HTML', fieldname:'styles_name', label:__('Styles'), reqd:false,
						description: __("")},
						{fieldtype:'Button', fieldname:'create_new', label:__('Ok') }
				]
			})
		var fd = dialog.fields_dict;

	        // $(fd.styles_name.wrapper).append('<div id="style">Welcome</div>')
	        return frappe.call({
				type: "GET",
				method: "tools.tools_management.custom_methods.get_styles_details",
				args: {
					"item": $('[data-fieldname="item_code"]').val(),
					"style": style_name 
				},
				callback: function(r) {
					if(r.message) {
						
						var result_set = r.message;
						this.table = $("<table class='table table-bordered'>\
	                       <thead><tr></tr></thead>\
	                       <tbody></tbody>\
	                       </table>").appendTo($(fd.styles_name.wrapper))

						columns =[['Style','10'],['Image','40'],['Value','40']]
						var me = this;
						$.each(columns, 
	                       function(i, col) {                  
	                       $("<th>").html(col[0]).css("width", col[1]+"%")
	                               .appendTo(me.table.find("thead tr"));
	                  }	);
						
						$.each(result_set, function(i, d) {
							var row = $("<tr>").appendTo(me.table.find("tbody"));
	                       $("<td>").html('<input type="radio" name="sp" value="'+d[0]+'">')
	                       		   .attr("style", d[0])
	                               .attr("image", d[1])
	                               .attr("value", d[2])
	                               .attr("abbr", d[3])
	                               .attr("customer_cost", d[4])
	                               .attr("tailor_cost", d[5])
	                               .attr("extra_cost", d[6])
	                               .appendTo(row)
	                               .click(function() {
	                               		  $(col_id[3]).html($(this).attr('image'))
	                                      // e.default_value = $(this).attr('value')
	                                      // e.abbreviation = $(this).attr('abbr')
	                                      // e.cost_to_customer = $(this).attr('customer_cost')
	                                      // e.cost_to_tailor = $(this).attr('tailor_cost')                           
	                               });
	                     
	                       $("<td>").html($(d[1]).find('img')).appendTo(row);
	                       $("<td>").html(d[2]).appendTo(row);                    
	               });
						
						dialog.show();
						$(fd.create_new.input).click(function() {						
							refresh_field('wo_style')	
							dialog.hide()
						})
					}
				}
			})	
	}
})


