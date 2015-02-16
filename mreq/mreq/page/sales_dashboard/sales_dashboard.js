// frappe.pages['sales-dashboard'].onload = function(wrapper) {
// 	frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'Sales Dashboard',
// 		single_column: true
// 	});
// 	console.log($(this))
// 	$(wrapper).find(".layout-main").html("<div class='user-settings'></div>\
// 	<table width = '100%'>\
// 		<tr><td width = '40%' bgcolor = '#FAFBFC' style='padding:0; margin:0;border-spacing: 0;'><div id= 'customer' width='100%'></div></td>\
// 			<td width = '60%' rowspan='2' valign='top'><div id= 'result_area' style ='height:600px;width:600px;overflow-y:auto;'  ></div></td>\
// 		</tr>\
// 		<tr><td width = '40%' bgcolor = '#FAFBFC' style='z-index: -1;'><div id= 'sales_invoice'></td></tr>\
// 	</table>");
// 	new frappe.SalesDashboard(wrapper);
// }

// frappe.SalesDashboard =  Class.extend({
// 	init: function(wrapper) {
// 		this.wrapper = wrapper;
// 		this.body = $(this.wrapper).find(".user-settings");
// 		this.render_customer();
// 		this.render_sales_invoice()
// 	},
// 	render_customer: function(){
// 		new frappe.Customer(this.wrapper)
// 	},
// 	render_sales_invoice: function(){
// 		new frappe.SalesInvoce(this.wrapper)
// 	}
// })

// frappe.Customer = Class.extend({
// 	init: function(wrapper, search_key){
// 		this.wrapper = wrapper;
// 		this.search_key = search_key;
// 		$(this.wrapper).find('#customer').empty()
// 		$(this.wrapper).find('#customer').html("<h3>1. Customer Details</h3>")
// 		new frappe.SearchArea(this.wrapper, $(this.wrapper).find('#customer'), search_key)
// 		this.get_customer_list()
// 	},
// 	get_customer_list: function(){
// 		var me = this;
// 		frappe.call({
// 			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_customer_list",
// 			args:{'search_key': this.search_key},
// 			callback: function(r){
// 				me.render_customer_list(r.message)
// 				// new frappe.SalesInvoce(me.wrapper,me.search_key)
// 			}
// 		})
// 	},
// 	render_customer_list: function(customers_list){
// 		var me = this;
// 		this.customer_tab = $(this.wrapper).find('#customer');
// 		columns = [[frappe._("Customer Name"), 100]];

// 		this.table = $("<table class='table table-bordered' style='height:50px;'>\
// 			<thead><tr></tr></thead>\
// 			<tbody style='display: block;height:150px;overflow-y: hidden;'></tbody>\
// 		</table>").appendTo(this.customer_tab);

// 		this.table.find("tbody").hover(function(){
//   			  $(this).css('overflow-y','auto')
//   			}, function(){
//     			$(this).css('overflow-y','hidden')
//     		}
//   		)

// 		$.each(columns, 
// 			function(i, col) {
// 			$("<th>").html(col[0]).css("width", col[1]+"%").css("allign","center")
// 				.appendTo(me.table.find("thead tr"));
// 		});

// 		$.each(customers_list, 
// 			function(i, cust) {
// 			var row = $("<tr id="+i+">").appendTo(me.table.find("tbody"));
// 			$("<td>").html(cust[0]).appendTo(row).click(function(){
// 				$('.bold').removeClass('bold'); // deselect
// 				$(this).addClass('bold');
// 				new frappe.CustomerForm(me.wrapper, 'open', $(this).text())
// 				new frappe.SalesInvoce(me.wrapper,$(this).text())
// 			})
// 		});
// 	}
// })

// frappe.SalesInvoce = Class.extend({
// 	init: function(wrapper, search_key){
// 		this.wrapper = wrapper;
// 		this.search_key = search_key;
// 		$(this.wrapper).find('#sales_invoice').empty()
// 		$(this.wrapper).find("#sales_invoice").html("<h3>2. Sales Invoice Details</h3>")
// 		new frappe.SearchArea(this.wrapper, $(this.wrapper).find('#sales_invoice'), search_key)
// 		this.get_si_list()
// 	},
// 	get_si_list: function(){
// 		var me = this;
// 		frappe.call({
// 			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_si_list",
// 			args:{'search_key': this.search_key},
// 			callback: function(r){
// 				me.render_si_list(r.message)
// 			}
// 		})	
// 	},
// 	render_si_list: function(si_list){
// 		var me = this;
// 		this.si_tab = $(this.wrapper).find('#sales_invoice');

// 		columns = [[frappe._("Salse Invoice"), 100]];

// 		this.table = $("<table class='table table-bordered'>\
// 			<thead><tr></tr></thead>\
// 			<tbody style='display: block;height:150px;overflow-y: hidden;'></tbody>\
// 		</table>").appendTo(this.si_tab);

// 		this.table.find("tbody").hover(function(){
//   			  $(this).css('overflow-y','auto')
//   			}, function(){
//     			$(this).css('overflow-y','hidden')
//     		}
//   		)

// 		$.each(columns, 
// 			function(i, col) {
// 			$("<th>").html(col[0]).css("width", col[1]+"%").css("align","center")
// 				.appendTo(me.table.find("thead tr"));
// 		});

// 		$.each(si_list, 
// 			function(i, si) {
// 			var row = $("<tr id="+i+">").appendTo(me.table.find("tbody"));
// 			$("<td>").html(si[0]).appendTo(row).click(function(){
// 				$('.bold').removeClass('bold'); // deselect
// 				$(this).addClass('bold');
// 				me.add_worklist($(this).text(), row)
// 				new frappe.SalesForm(me.wrapper, 'open', '',$(this).text())
// 			})

// 		});
// 	},
// 	add_worklist:function(si_num, td){
// 		console.log(['test', si_num])
// 		var me = this;
// 		this.si_td = td;
// 		$('.btn-default').remove();
// 		frappe.call({
// 			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_work_orders",
// 			args:{'si_num': si_num},
// 			callback:function(r){
// 				if(r.message){
// 					$.each(r.message, function(i, workorder){
// 						$("<button class='btn btn-small btn-default'><i class='icon-search'></i>"+workorder+"</button>")
// 						.appendTo($(me.si_td))
// 						.click(function(){
// 							new frappe.WOForm(me.wrapper, $(this).text())
// 						})
// 					})	
// 				}
				
// 			}
// 		})
// 	}
// })

// frappe.SearchArea = Class.extend({
// 	init:function(wrapper, area, search_key){
// 		this.wrapper = wrapper;
// 		this.area = area
// 		this.search_key = search_key
// 		this.render_search_area()
// 	},
// 	render_search_area: function(){
// 		var me = this;
// 		var row = $("<tr>").appendTo(this.area);
// 		$('<td>').html('<input class="form-control" \
// 			placeholder="Search Area">').appendTo(row);

// 		$(me.area).find('.form-control').val(this.search_key)

// 		$("<button class='btn btn-small btn-info'><i class='icon-search'></i></button>")
// 			.appendTo($("<td>").appendTo(row))
// 			.click(function() {
// 				if($(me.area).attr('id') == 'customer')
// 					new frappe.Customer(me.wrapper, $(me.area).find('.form-control').val())
// 				if($(me.area).attr('id') == 'sales_invoice')
// 					new frappe.SalesInvoce(me.wrapper, $(me.area).find('.form-control').val())
// 			});

// 		$("<button class='btn btn-small btn-info'><i class='icon-plus'></i></button>")
// 			.appendTo($("<td>").appendTo(row))
// 			.click(function() {
// 				if($(me.area).attr('id') == 'customer')
// 					new frappe.CustomerForm(me.wrapper, 'new')
// 				if($(me.area).attr('id') == 'sales_invoice')
// 					new frappe.SalesForm(me.wrapper, 'new', me.search_key, '')
// 			});
// 	}

// })

// frappe.CustomerForm = Class.extend({
// 	init: function(wrapper, form_type, customer){
// 		this.wrapper = wrapper;

// 		this.field_list = {
// 			'Basic Info':[
// 				['Full Name', 'Data', '','customer_name'], 
// 				['Customer Group', 'Link', 'Customer Group', 'customer_group'], 
// 				['Type','Select','\nCompany\nIndividual','customer_type'], 
// 				['Territory', 'Link', 'Territory', 'territory']],
// 			'Address Details':[ 
// 				['Address Line 1', 'Data', '', 'address_line1'], 
// 				['Address Line 2', 'Data', '', 'address_line2'], 
// 				['City', 'Data', '', 'city']],
// 			'Contact Details':[
// 				['Mobile', 'Data', '', 'mobile_no'], 
// 				['Landline Number','Data', '', 'phone'], 
// 				['Email Id','Data', '', 'email_id'], 
// 				['Designation', 'Data', '', 'designation'], 
// 				['Date of Birth','Date', '', 'date_of_birth'], 
// 				['Anniversary Date', 'Date', '', 'anniversary_date']],
// 			'Full Body Measurement Details':[
// 				['Parameter', 'Link', 'Measurement', 'parameter'],
// 				['Value', 'Data', '', 'value']]
// 		}

// 		if(form_type == 'new')
// 			this.render_customer_form(form_type);

// 		if(form_type == 'open')
// 			this.open_record(customer);

// 	},
// 	render_customer_form: function(form_type){
// 		var me = this;
// 		$(this.wrapper).find('#result_area').empty()
// 		this.field_area = $(this.wrapper).find('#result_area')

// 		$.each(this.field_list, 
// 			function(i, field) {
// 				me.table = $("<table>\
// 						<tbody></tbody>\
// 						</table>").appendTo(me.field_area);
// 				me.render_child(field, form_type, i)

// 		})

// 		var row = $("<tr>").appendTo(me.table.find("tbody"));
// 		if(form_type == 'new'){
// 			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%' ><i class='icon-plus'></i></button>")
// 			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
// 			.click(function() {
// 				me.add_body_measurement()
// 			});

// 			this.table1 = $("<table class='table table-bordered'>\
// 				<thead><tr></tr></thead>\
// 					<tbody '></tbody>\
// 				</table>").appendTo(this.table.find('tbody'));

// 			columns = [["Parameter",50], ["Value", 100]];
			
// 			$.each(columns, 
// 					function(i, col) {
// 					$("<th>").html(col[0]).css("width", col[1]+"px")
// 						.appendTo(me.table1.find("thead tr"));
// 			});
			
// 			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
// 			.appendTo($("<td colspan='2' align='center'>").appendTo($('#result_area')))
// 			.click(function() {
// 				me.create_customer()
// 			});
// 		}
// 		else{
// 			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-folder-open'></i> Open </button>")
// 			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
// 			.click(function() {
// 				window.open("#Form/Customer/"+$('[data-fieldname="customer_name"]').val(), "_self");
// 			});


// 			area = $('[data-fieldname="customer_name"]').closest('tbody');

// 			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
// 			.appendTo($("<td align='center'>").appendTo(area))
// 			.click(function() {
// 				$('#image_viewer').empty();
// 				frappe.upload.make({
// 					parent: $('#image_viewer'),
// 					args:{
// 						from_form: 1,
// 						doctype: 'Customer',
// 						docname: $('[data-fieldname="customer_name"]').val(),
// 					},
// 					callback: function(attachment, r) {
// 						console.log(attachment)
// 					}
// 				})
// 			});

// 			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
// 			.appendTo($("<td align='center'>").appendTo(area))
// 			.click(function() {
// 				frappe.call({
// 					method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_images",
// 					args:{'name': $('[data-fieldname="customer_name"]').val()},
// 					callback:function(r){
// 						me.render_carousels(r.message)
// 					}
// 				})
// 			});
// 			$("<div id='image_viewer' width = '100%'></div>").appendTo(area)
// 		}
// 		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%")
// 	},
// 	render_carousels: function(files){
// 		var me = this;
// 		$('#image_viewer').empty();


// 		var dialog = new frappe.ui.Dialog({
// 		title:__('Images'),
// 		fields: [{fieldtype:'HTML', fieldname:'image_name', label:__('Images'), reqd:false,
// 			description: __("")}
// 		]})

// 		var fd = dialog.fields_dict;

// 		this.img_viewer = $('<div id="banner-slide" style="height:200px; width:300px;  textAlign:center">\
// 		<ul class="bjqs">\
// 		</ul></div>').appendTo($(fd.image_name.wrapper));
// 		$.each(files,function(i,d) {  
// 			path = '/files/' + d[0]
// 			var row = $("<li>").appendTo(me.img_viewer.find("ul"));
// 			    $("<li>").html('<li><img src="'+path+'" width="500px" style = "max-width:100%;max-height:100%;vertical-align: middle;"text-align="center" title="secound caption"></li>')
// 			           .appendTo(me.img_viewer.find(row));
// 		});
// 		this.img_viewer.bjqs({

// 			height      : 500,
// 			width       : 500,
// 			responsive  : true,
// 			randomstart   : true
// 		});
// 		dialog.show();
// 	},
// 	render_child: function(fields, form_type, key){
// 		var me = this;

// 		$('<h4 class="col-md-12" style="margin: 0px 0px 15px;">\
// 			<i class="icon-in-circle icon-user"></i>\
// 			<span class="section-count-label"></span>.'+key+'. </h4>').prependTo(me.table)

// 		var row = $("<tr>").appendTo(me.table.find("tbody"));
// 		$.each(fields, 
// 			function(i, field) {
// 				$('<td>').html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%">'+field[0]+'</label>').appendTo(row);
				
// 				if(i%2 == 1){
// 					row = $("<tr>").appendTo(me.table.find("tbody"));
// 					for(j=i-1; j<=(i); j++){
// 						var td = $("<td>").appendTo(row)
// 						frappe.ui.form.make_control({
// 							df: {
// 							    "fieldtype": fields[j][1],
// 								"fieldname": fields[j][3],
// 								"options": fields[j][2],
// 								"label": fields[j][0]
// 								},
// 							parent:td,
// 						}).make_input();

// 					}
// 					row = $("<tr>").appendTo(me.table.find("tbody"));
// 				}
// 				else if(i == fields.length-1){
// 					row = $("<tr>").appendTo(me.table.find("tbody"));
// 					var td = $("<td>").appendTo(row)
// 					frappe.ui.form.make_control({
// 							df: {
// 							    "fieldtype": fields[i][1],
// 								"fieldname": fields[i][3],
// 								"options": fields[i][2],
// 								"label": fields[i][0]
// 								},
// 							parent:td,
// 						}).make_input();
// 				}
// 			})

// 		$( "label" ).remove( ".col-xs-4" );
// 		$( "div.col-xs-8" ).addClass( "col-xs-12" )
// 		$( "div" ).removeClass( "col-xs-8" );
// 		$( "div.col-xs-12" ).css('padding','2%');
// 	},
// 	add_body_measurement:function(){
// 		row = $('<tr>').appendTo(this.table1.find('tbody')[0])
// 		$('<td>').html($('[data-fieldname="parameter"]').val()).appendTo(row);
// 		$('<td>').html($('[data-fieldname="value"]').val()).appendTo(row);

// 	},
// 	create_customer: function(){
// 		var me = this;
// 		this.cust_details = {};
// 		$.each(this.field_list, function(key, field) {
// 			if(key!='Full Body Measurement Details'){
// 				$.each(field, function(id, values){
// 					me.cust_details[values[3]] = $('[data-fieldname="'+values[3]+'"]').val()
// 				})
// 			}
// 			else{
// 				me.cust_details[key] = [];
// 				me.table1.find('tr').each(function (tr_id, tr_val) {
// 					var $tds = $(tr_val).find('td')
// 					if($tds.length != 0){
// 						measurement_details = {}
// 						measurement_details['parameter'] = $tds.eq(0).text();
// 						measurement_details['value'] = $tds.eq(1).text();
// 						me.cust_details[key].push(measurement_details)
// 					}
// 				})

// 			}
// 		})
// 		console.log(this.cust_details)
// 		frappe.call({
// 			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.create_customer",
// 			args:{'cust_details': this.cust_details},
// 			callback: function(r){
// 				new frappe.Customer(me.wrapper)
// 			}
// 		})	
// 	},
// 	open_record: function(customer){
// 		var me = this;
// 		frappe.call({
// 			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_cust_details",
// 			args:{'customer': customer},
// 			callback: function(r){
// 				me.render_customer_form()
// 				$.each(r.message, function(key, val){

// 					$('[data-fieldname="'+key+'"]').attr("disabled","disabled")
// 					$('[data-fieldname="'+key+'"]').attr("value", val)
// 				})
// 			}
// 		})	
// 	}

// })


// frappe.SalesForm = Class.extend({
// 	init: function(wrapper, form_type, search_key, si_no){
// 		this.si_no = si_no;
// 		this.wrapper = wrapper;
// 		this.search_key = search_key;
// 		this.reservation_details = {}
// 		this.fabric_detail = {}
// 		this.split_qty_dict = {}

// 		this.field_list = {
// 			'Basic Info':[['Customer', 'Link', 'Customer','customer'],
// 				['Delivery Date','Date','','delivery_date'], 
// 				['Book Date', 'Date', '', 'posting_date'], 
// 				['Release', 'Select', 'No\nYes', 'release']],
// 			'Tailoring Item Details':[
// 				['Service', 'Link', 'Price List','tailoring_price_list'], 
// 				['Item Code', 'Link', 'Item','tailoring_item_code'], 
// 				['Fabric Code', 'Link', 'Item','fabric_code'],
// 				['Size', 'Link', 'Size','tailoring_size'],
// 				['Width', 'Link', 'Width','width'],
// 				['Qty', 'Data', '','tailoring_qty'],
// 				['Fabric Qty', 'Data', '','fabric_qty'],
// 				['Rate', 'Data', '','tailoring_rate'],
// 				['Delivery Branch (Tailoring)', 'Link', 'Branches', 'tailoring_branch']],
// 			'Merchandise Item Details':[
// 				['Price List', 'Link', 'Price List','merchandise_price_list'], 
// 				['Item Code', 'Link', 'Item','merchandise_item_code'], 
// 				['Qty', 'Data', '','merchandise_qty'],
// 				['Rate', 'Data', '','merchandise_rate'],
// 				['Delivery Branch (Merchandise)', 'Link', 'Branches', 'merchandise_branch']],
// 			'Taxes and Charges':
// 				[['Taxes and Charges', 'Link', 'Sales Taxes and Charges Master', 'taxes_and_charges']],
// 			'Total':
// 				[['Total', 'Data', '', 'total'],
// 				 ['Grand Total', 'Data', '', 'grand_total']]
// 		};
		
// 		if(form_type == 'new')
// 			this.render_sales_form(form_type);

// 		if(form_type == 'open')
// 			this.open_record(si_no, form_type);

// 	},
// 	render_sales_form: function(form_type){
// 		var me = this;
// 		$('#result_area').empty()
// 		this.field_area = $(this.wrapper).find('#result_area')

// 		$.each(this.field_list, 
// 			function(i, field) {
// 				me[i+'_1'] = $("<table>\
// 						<tbody style=''></tbody>\
// 						</table>").appendTo(me.field_area);
// 				me.render_child(field, form_type, i)

// 		})

// 		if(form_type == 'new'){
// 			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
// 			.appendTo($("<td colspan='2' align='center'>").appendTo(me.field_area))
// 			.click(function() {
// 				me.create_si()
// 			});
// 		}
// 		else{
// 			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%;margin-left:40%;'><i class='icon-folder-open'></i> Open </button>")
// 			.appendTo(me.field_area)
// 			.click(function() {
// 				console.log(me.si_no)
// 				window.open("#Form/Sales Invoice/"+me.si_no, "_self");
// 			});
// 		}

// 		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%")
// 	},
// 	render_child: function(fields, form_type, key){
// 		var me = this;

// 		$('<h4 class="col-md-12" style="margin: 0px 0px 15px;">\
// 			<i class="icon-in-circle icon-user"></i>\
// 			<span class="section-count-label"></span>.'+key+'. </h4>').prependTo(me[key+'_1'])

// 		var row = $("<tr>").appendTo(me[key+'_1'].find("tbody"));
// 		if(me.type_checker(form_type, key)){
// 			$.each(fields, 
// 				function(i, field) {
// 					$('<td>').html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%">'+field[0]+'</label>').appendTo(row);
					
// 					if(i%2 == 1){
// 						row = $("<tr>").appendTo(me[key+'_1'].find("tbody"));
// 						for(j=i-1; j<=(i); j++){
// 							var td = $("<td>").appendTo(row)
// 							frappe.ui.form.make_control({
// 								df: {
// 								    "fieldtype": fields[j][1],
// 									"fieldname": fields[j][3],
// 									"options": fields[j][2],
// 									"label": fields[j][0]
// 									},
// 								parent:td,
// 							}).make_input();

// 						}
// 						row = $("<tr>").appendTo(me[key+'_1'].find("tbody"));
// 					}
// 					else if(i == fields.length-1){
// 						row = $("<tr>").appendTo(me[key+'_1'].find("tbody"));
// 						var td = $("<td>").appendTo(row)
// 						frappe.ui.form.make_control({
// 								df: {
// 								    "fieldtype": fields[i][1],
// 									"fieldname": fields[i][3],
// 									"options": fields[i][2],
// 									"label": fields[i][0]
// 									},
// 								parent:td,
// 							}).make_input();
// 					}
// 				})
// 		}
// 		if(key == 'Tailoring Item Details'){
// 			var row1 = $("<tr>").appendTo(me[key+'_1'].find("tbody"));
// 			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%; margin-left:30%'><i class='icon-save'></i> Slipt Qty </button>")
// 			.appendTo($("<td align='center'>").appendTo(row1))
// 			.click(function() {
// 				new frappe.SplitQty(me.wrapper, me)
// 			});
// 			$("<button class='btn btn-small btn-primary' id = 'reserve_fabric' style='margin-bottom:2%; margin-left:30%'><i class='icon-save'></i> Reserve Fabric </button>")
// 			.appendTo($("<td align='center'>").appendTo(row1))
// 			.click(function() {
// 				me.reserve_fabric()
// 			});
// 		}

// 		$( "label" ).remove( ".col-xs-4" );
// 		$( "div.col-xs-8" ).addClass( "col-xs-12" )
// 		$( "div" ).removeClass( "col-xs-8" );
// 		$( "div.col-xs-12" ).css('padding','2%');

// 		$('[data-fieldname="customer"]').val(this.search_key)

// 		$('[data-fieldname="fabric_code"]').change(function(){
// 			frappe.call({
// 				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_fabric_width",
// 				args:{'fabric_code':$('[data-fieldname="fabric_code"]').val()},
// 				callback: function(r){
// 					$('[data-fieldname="width"]').attr('value', r.message)
// 				}
// 			})
// 		})


// 		$('[data-fieldname="tailoring_size"]').change(function(){
// 			frappe.call({
// 				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_size_and_rate",
// 				args:{'price_list': $('[data-fieldname="tailoring_price_list"]').val(), 
// 					'item_code':$('[data-fieldname="tailoring_item_code"]').val(),
// 					'fabric_code':$('[data-fieldname="fabric_code"]').val(),
// 					'branch':$('[data-fieldname="branch"]').val(),
// 					'size': $('[data-fieldname="tailoring_size"]').val()
// 					},
// 				callback: function(r){
// 					$('[data-fieldname="tailoring_rate"]').attr('value', r.message)
// 				}
// 			})
// 		})

// 		$('[data-fieldname="tailoring_qty"]').change(function(){
// 			frappe.call({
// 				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_fabric_qty",
// 				args:{'item_code':$('[data-fieldname="tailoring_item_code"]').val(),
// 					'width': $('[data-fieldname="width"]').val(),
// 					'size': $('[data-fieldname="tailoring_size"]').val()
// 					},
// 				callback: function(r){
// 					$('[data-fieldname="fabric_qty"]').attr('value', flt(r.message) * flt($('[data-fieldname="tailoring_qty"]').val()))
// 				}
// 			})
// 		})

// 		$('[data-fieldname="fabric_code"]').change(function(){
// 			frappe.call({
// 				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.check_swatch_group",
// 				args:{'fabric_code':$('[data-fieldname="fabric_code"]').val()},
// 				callback: function(r){
// 					if(r.message == 1){
// 						$('#reserve_fabric').hide()
// 					}
// 					else{
// 						$('#reserve_fabric').show()	
// 					}
// 				}
// 			})
// 		})


// 		$('[data-fieldname="merchandise_item_code"]').change(function(){
// 			frappe.call({
// 				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_merchandise_item_price",
// 				args:{'price_list': $('[data-fieldname="merchandise_price_list"]').val(), 
// 					'item_code':$('[data-fieldname="merchandise_item_code"]').val()},
// 				callback: function(r){
// 					$('[data-fieldname="merchandise_rate"]').attr('value', r.message)
// 				}
// 			})
// 		})

// 		if(key!='Basic Info' && key != 'Total' && key != 'Taxes and Charges'){
// 			if(key == 'Tailoring Item Details')
// 				columns = [["Price List",50], ["Item Code", 100], ["Fabric Code", 100], ["Size", 100], ["Width", 100], ["Qty", 100], ["Fabric Qty", 100], ['Rate', 100],['Tailoring Branch', 100], ['', 50]];
			
// 			if(key == 'Merchandise Item Details')
// 				columns = [["Price List",50], ["Item Code", 100], ["Qty", 100], ['Rate', 100], ['Merchandise Branch', 100],['', 50]];
			
// 			// if(key == 'Taxes and Charges')
// 			// 	columns = [["Price List",50], ["Item Code", 100], ["Qty", 100], ['Rate', 100], ['Merchandise Branch', 100]];

// 			if(form_type == 'new'){
// 				$("<button class='btn btn-small btn-primary' style='margin-bottom:2%' id='"+key+"'><i class='icon-plus'></i></button>")
// 				.appendTo($("<td colspan='2' align='center'>").appendTo(row))
// 				.click(function() {
// 					me.add_row($(this).attr('id'))
// 				});
// 			}

// 			this[key] =$("<table class='table table-bordered' id='sp'>\
// 				<thead><tr></tr></thead>\
// 				<tbody></tbody>\
// 			</table>").appendTo(me.field_area)

// 			$.each(columns, 
// 				function(i, col) {
// 				$("<th>").html(col[0]).css("width", col[1]+"px")
// 					.appendTo(me[key].find("thead tr"));
// 			});
// 		}
		
// 	},
// 	type_checker:function(form_type, key){
// 		if(form_type == 'new')
// 			return true;
// 		else if(form_type == 'open'){
// 			if(key == 'Basic Info' || key == 'Total')
// 				return	 true;
// 			else
// 				return false;
// 		}
// 	},
// 	add_row:function(key){
// 		var me = this;
// 		this.tailoring_item_details = {};
// 		this.retrive_data(this.field_list[key])

// 		var row = $("<tr>").appendTo(me[key].find("tbody"));
		
// 		$.each(this.tailoring_item_details, function(i, d) {	
// 			$("<td>").html(d).appendTo(row);
// 		});
// 		// if(key == 'Tailoring Item Details')
// 		// 	$("<td>").html(me.split_qty_dict).appendTo(row)

// 		$('<button  class="remove"><i class="icon-trash"></i></button>').appendTo($("<td>")).appendTo(row)
// 				.click(function(){
// 					$(this).parent().remove()
// 					me.calc_total_amt()
// 				});
// 		me.calc_total_amt()
// 	},
// 	retrive_data: function(fields){
// 		var me = this;
// 		$.each(fields, function(i, field) {
// 			me.tailoring_item_details[field[3]] = $('[data-fieldname="'+field[3]+'"]').val()
// 		})	
// 	},
// 	reserve_fabric: function(){
// 		var me1 = this;
// 		var image_data;
// 		var dialog = new frappe.ui.Dialog({
// 				title:__('Fabric Details'),
// 				fields: [
// 					{fieldtype:'HTML', fieldname:'styles_name', label:__('Styles'), reqd:false,
// 						description: __("")},
// 						{fieldtype:'Button', fieldname:'create_new', label:__('Ok') }
// 				]
// 			})
// 		var fd = dialog.fields_dict;

// 	        // $(fd.styles_name.wrapper).append('<div id="style">Welcome</div>')
// 	        return frappe.call({
// 				type: "GET",
// 				method: "tools.tools_management.custom_methods.get_warehouse_wise_stock_balance",
// 				args: {
// 					"item": $('[data-fieldname="fabric_code"]').val(),
// 					"qty": $('[data-fieldname="fabric_qty"]').val()
// 				},
// 				callback: function(r) {
// 					if(r.message) {
// 						var result_set = r.message;
// 						this.table = $("<table class='table table-bordered'>\
// 	                       <thead><tr></tr></thead>\
// 	                       <tbody></tbody>\
// 	                       </table>").appendTo($(fd.styles_name.wrapper))

// 						columns =[['Branch','40'],['Qty','40'], ['Reserv Qty', 50], ['','10'],]
// 						var me = this;
// 						$.each(columns, 
// 	                       function(i, col) {                  
// 	                       $("<th>").html(col[0]).css("width", col[1]+"%")
// 	                               .appendTo(me.table.find("thead tr"));
// 	                  }	);
						
// 						$.each(result_set, function(i, d) {
// 							console.log(d)
// 							var row = $("<tr>").appendTo(me.table.find("tbody"));
// 	                       $("<td>").html(d[2]).appendTo(row);
// 	                       $("<td>").html(d[1]).appendTo(row); 
// 	                       $("<td>").html('<input type="Textbox" class="text_box">').appendTo(row);    
// 	                       $("<td>").html('<input type="checkbox" name="sp" value="'+d[0]+'">')
// 	                       		   .attr("style", d[0])
// 	                               .attr("image", d[1])
// 	                               .appendTo(row)
// 	                               .click(function() {	                          
// 	                                      if(me1.fabric_detail[d[2]]){
// 	                                      	me1.fabric_detail[d[2]].push([$('[data-fieldname="fabric_code"]').val(), $(this).closest("tr").find('.text_box').val(), $('[data-fieldname="tailoring_item_code"]').val()])
// 	                                      }
// 	                                      else{
// 	                                      	me1.fabric_detail[d[2]] = []
// 	                                       	me1.fabric_detail[d[2]].push([$('[data-fieldname="fabric_code"]').val(), $(this).closest("tr").find('.text_box').val(), $('[data-fieldname="tailoring_item_code"]').val()])
// 	                                       }
// 	                               });               
// 	               });
						
// 						dialog.show();
// 						$(fd.create_new.input).click(function() {
// 							me1.reservation_details[$('[data-fieldname="tailoring_item_code"]').val()] = JSON.stringify(me1.fabric_detail)
// 							dialog.hide()
// 						})
// 					}
// 				}
// 			})	
// 	},
// 	create_si: function(){
// 		var me = this;
// 		this.invoce_details = {};
// 		$.each(this.field_list, function(tab_name, fields){
// 			if(tab_name != 'Basic Info' && tab_name != 'Total' && tab_name != 'Taxes and Charges'){
// 				var si_details_list = []
// 				console.log(tab_name)
// 				me[tab_name].find('tr').each(function (tr_id, tr_val) {
// 					if(tr_id != 0){
// 						var $tds = $(this).find('td')
// 						var values = [];
// 						for(i=0; i< $tds.length; i++){
// 							values.push($tds.eq(i).text())
// 						}
// 						si_details_list.push(values)
// 					}	
// 				})
// 				me.invoce_details[tab_name] = si_details_list
// 			}
// 			else{
// 				var si_details_list = []
// 				$.each(fields, function(i, field) {
// 					si_details_list.push($('[data-fieldname="'+field[3]+'"]').val())
// 				})
// 				me.invoce_details[tab_name] = [si_details_list]
// 			}
// 		})
// 		frappe.call({
// 			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.create_si",
// 			args:{'si_details': me.invoce_details, 'fields':me.field_list, 'reservation_details': me.reservation_details},
// 			callback: function(r){
// 				console.log(r.message)
// 				// new frappe.SalesInvoce(me.wrapper)
// 				me.open_record(r.message, 'open')
// 			}
// 		})
// 	},
// 	render_tax_struct:function(tax_struct){
// 		var me = this;
// 		console.log(me['Taxes and Charges_1'])
// 		console.log(me['Taxes and Charges_1'].find('tbody'))
// 		me['Taxes and Charges_1'].append(tax_struct)
// 	},
// 	open_record:function(si_no, form_type){
// 		var me = this;
// 		frappe.call({
// 			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_si_details",
// 			args:{'name': si_no},
// 			callback: function(r){
// 				me.si_no = si_no
// 				me.render_sales_form(form_type)
// 				me.add_values(r.message)
// 				me.render_tax_struct(r.message['tax_details'])
// 				me.calc_total_amt(r.message['tot'])
// 			}
// 		})
// 	},
// 	add_values:function(si_details){
// 		console.log(si_details['si'])
// 		var me = this;

// 		//Render Basic Details 
// 		$.each(si_details['si'], function(key, value){
// 			$.each(value, function(key, val){
// 				$('[data-fieldname="'+key+'"]').attr("disabled","disabled")
// 				$('[data-fieldname="'+key+'"]').val(val)
// 			})
// 		})	

// 		//Render Tailoring Item Details
// 		$.each(si_details['tailoring_item'], 
// 				function(i, values) {
// 				var row = $("<tr>").appendTo(me['Tailoring Item Details'].find("tbody"));
// 				$.each(values, function(i, d) {	
// 					$("<td>").html(d).appendTo(row);
// 				});
// 			});

// 		//Render Merchandise Item Details
// 		$.each(si_details['merchandise_item'], 
// 				function(i, values) {
// 				var row = $("<tr>").appendTo(me['Merchandise Item Details'].find("tbody"));
// 				$.each(values, function(i, d) {	
// 					$("<td>").html(d).appendTo(row);
// 				});
// 			});

// 	},
// 	calc_total_amt: function(grand_total){
// 		console.log('test')
// 		var total = 0.0;
// 		var me = this ;
// 		me['Tailoring Item Details'].find('tr').each(function (tr_id, tr_val) {
// 			if(tr_id != 0){
// 				var $tds = $(this).find('td')
// 				sub_tot = flt($tds.eq(5).text()) * flt($tds.eq(7).text())
// 				total += sub_tot
// 			}	
// 		})

// 		me['Merchandise Item Details'].find('tr').each(function (tr_id, tr_val) {
// 			if(tr_id != 0){
// 				var $tds = $(this).find('td')
// 				sub_tot = flt($tds.eq(2).text()) * flt($tds.eq(3).text())
// 				total += sub_tot
// 			}	
// 		})
		
// 		$('[data-fieldname="total"]').attr("disabled","disabled")
// 		$('[data-fieldname="total"]').val(total)

// 		$('[data-fieldname="grand_total"]').attr("disabled","disabled")
// 		$('[data-fieldname="grand_total"]').val(grand_total?grand_total:total)
// 	}

// })


// frappe.SplitQty =  Class.extend({
//     init : function(wrapper, si){
//         // this.data = locals[cdt][cdn]
//         this.split_init()
//         this.si = si
//     },

//     split_init: function(){
//         this.make_structure()
//         // this.render_split_data()
//         this.add_new_split_data()
//         this.save_data()
//         this.remove_qty()
//     },

//     make_structure: function(){
//             this.dialog = new frappe.ui.Dialog({
//                 title:__(' Styles'),
//                 fields: [
//                 {fieldtype:'Int', fieldname:'qty', label:__('Qty'), reqd:false,
//                         description: __("")},
//                         {fieldtype:'Button', fieldname:'add_qty', label:__('Add'), reqd:false,
//                         description: __("")},
//                     {fieldtype:'HTML', fieldname:'styles_name', label:__('Styles'), reqd:false,
//                         description: __("")},
//                         {fieldtype:'Button', fieldname:'create_new', label:__('Ok') }
//                 ]
//             })
//             this.fd = this.dialog.fields_dict;
//             this.div = $('<div id="myGrid" style="width:100%;height:200px;margin:10px;overflow-y:scroll">\
//                         <table class="table table-bordered" style="background-color: #f9f9f9;height:10px" id="mytable">\
//                         <thead><tr><td>Item</td><td>Qty</td><td>Remove</td></tr>\
//                         </thead><tbody></tbody></table></div>').appendTo($(this.fd.styles_name.wrapper))
//             this.dialog.show()
//     },

//     render_split_data: function(){
//         var me = this;
//         if(this.si.split_qty_dict){
//             column = JSON.parse(this.si.split_qty_dict)
//             $.each(column, function(i){
//                 this.table = $(me.div).find('#mytable tbody').append('<tr><td style="background-color:#FFF">'+column[i].tailoring_item_code+'</td><td style="background-color:#FFF"><input type="Textbox" class="text_box" value="'+column[i].qty+'"></td><td>&nbsp;<button  class="remove">X</button></td></tr>')
//             })
//         }
//     },

//     add_new_split_data: function(){
//         var me = this;
//         $(this.fd.add_qty.input).click(function(){
//             if(me.fd.qty.last_value){
//                 this.table = $(me.div).find('#mytable tbody').append('<tr><td style="background-color:#FFF">'+$('[data-fieldname="tailoring_item_code"]').val()+'</td><td style="background-color:#FFF"><input type="Textbox" class="text_box" value="'+me.fd.qty.last_value+'"></td><td>&nbsp;<button  class="remove">X</button></td></tr>')
//                 me.remove_qty()                
//             }    
//         })
        
//     },

//     save_data: function(){
//         var me =this;
//         $(this.fd.create_new.input).click(function(){
//             me.split_dict={}
//             var sum = 0
//             $(me.div).find('#mytable tbody tr').each(function(i){
//                 var key = ['tailoring_item_code', 'qty', 'cancel'];
//                 var qty_data={}
//                 cells = $(this).find('td')
//                 $(cells).each(function(i){
//                     qty_data[key[i]] = $(this).find('.text_box').val() || $(this).text();
//                     val = parseInt($(this).find('.text_box').val())
//                     if(val){
//                         sum += val;
//                     }
//                 })
//                 me.split_dict[i] = qty_data
//             })
//             me.validate_data(sum)
//         })
//     },

//     validate_data: function(qty){
//         var me = this;
//         if(parseInt(qty)==parseInt($('[data-fieldname="tailoring_qty"]').val())) {
//             this.si.split_qty_dict = JSON.stringify(me.split_dict)
//             refresh_field('sales_invoice_items_one')
//             console.log(this.si.split_qty_dict)
//             me.dialog.hide()
//         }else{
//             alert("Split qty should be equal to Taiiloring Product Qty")
//             me.dialog.show()
//         }
//     },

//     remove_qty: function(){
//         var me = this;
//         $(this.div).find('.remove').click(function(){
//             $(this).parent().parent().remove()
//         })
//     }
// })




// frappe.WOForm = Class.extend({
// 	init: function(wrapper, woname){
// 		this.wrapper = wrapper;
// 		this.woname = woname;
// 		this.style_details = {}
// 		this.field_list = {
// 			"Work Order":[
// 					['Sales Invoice No','Link','Sales Invoice','sales_invoice_no'],
// 					['Item code', 'Link', 'Item', 'item_code'],
// 					['Customer Name', 'Data', '', 'customer'],
// 					['Serial NO', 'Small Text', '', 'serial_no_data']
// 				],
// 			"Style Transactions":[
// 					['Field Name', 'Link', 'Style', 'field_name']
// 				],
// 			"Measurement Item":[
// 					['Parameter', 'Link', 'Measurement', 'parameter'],
// 					['Abbreviation', 'Data', '', 'abbreviation'],
// 					['Value', 'Float', '', 'value']
// 				]
// 		}

// 		this.render_wo_form();
		
// 	},
// 	render_wo_form: function(){
// 		var me = this;
// 		$('#result_area').empty()
// 		this.field_area = $(this.wrapper).find('#result_area')

// 		$.each(this.field_list, 
// 			function(i, field) {
// 				console.log([i, field])
// 				me.table1 = $("<table>\
// 						<tbody style=''></tbody>\
// 						</table>").appendTo(me.field_area);
// 				me.render_child(field, i)

// 		})

// 		$("<button class='btn btn-small btn-primary' style='margin-bottom:2%; margin-left:5%'><i class='icon-save'></i> Save </button>")
// 		.appendTo(me.field_area)
// 		.click(function() {
// 			me.update_wo()
// 			// window.open("#Form/Customer/"+$('[data-fieldname="customer_name"]').val(), "_self");
// 		});

// 		$("<button class='btn btn-small btn-primary' style='margin-bottom:2%;margin-left:5%'><i class='icon-folder-open'></i> Open </button>")
// 		.appendTo(me.field_area)
// 		.click(function() {
// 			// me.update_wo()
// 			window.open("#Form/Work Order/"+me.woname, "_self");
// 		});

// 		// $("<button class='btn btn-small btn-primary' style='margin-bottom:2%;margin-left:5%'><i class='icon-folder-open'></i> Draw Canvas </button>")
// 		// .appendTo(me.field_area)
// 		// .click(function() {
// 		// 	frappe.route_options = { work_order: me.woname};
// 		// 	frappe.set_route("imgcanvas");
// 		// });
	
	

// 		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%")
// 	},
// 	render_child: function(fields, key){
// 		var me = this;

// 		$('<h4 class="col-md-12" style="margin: 0px 0px 15px;">\
// 			<i class="icon-in-circle icon-user"></i>\
// 			<span class="section-count-label"></span>.'+key+'. </h4>').prependTo(me.table1)

// 		var row = $("<tr>").appendTo(me.table1.find("tbody"));
// 		$.each(fields, 
// 			function(i, field) {
// 				$('<td>').html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%">'+field[0]+'</label>').appendTo(row);
				
// 				if(i%2 == 1){
// 					row = $("<tr>").appendTo(me.table1.find("tbody"));
// 					for(j=i-1; j<=(i); j++){
// 						var td = $("<td>").appendTo(row)
// 						frappe.ui.form.make_control({
// 							df: {
// 							    "fieldtype": fields[j][1],
// 								"fieldname": fields[j][3],
// 								"options": fields[j][2],
// 								"label": fields[j][0]
// 								},
// 							parent:td,
// 						}).make_input();

// 					}
// 					row = $("<tr>").appendTo(me.table1.find("tbody"));
// 				}
// 				else if(i == fields.length-1){
// 					row = $("<tr>").appendTo(me.table1.find("tbody"));
// 					var td = $("<td>").appendTo(row)
// 					frappe.ui.form.make_control({
// 							df: {
// 							    "fieldtype": fields[i][1],
// 								"fieldname": fields[i][3],
// 								"options": fields[i][2],
// 								"label": fields[i][0]
// 								},
// 							parent:td,
// 						}).make_input();
// 				}
// 			})

// 		$( "label" ).remove( ".col-xs-4" );
// 		$( "div.col-xs-8" ).addClass( "col-xs-12" )
// 		$( "div" ).removeClass( "col-xs-8" );
// 		$( "div.col-xs-12" ).css('padding','2%');

// 		if(key!='Work Order'){

// 			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%' id='"+key+"'><i class='icon-plus'></i></button>")
// 			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
// 			.click(function() {
// 				me.add_row($(this).attr('id'))
// 			});

// 			if(key == 'Style Transactions')
// 				columns = [["Field Name",50], ["Name", 100], ["Abbreviation", 100], ['Image', 100],["View", 100]];
// 			if(key == 'Measurement Item')
// 				columns = [["Parameter",50], ["Abbreviation", 100], ["Value", 100]];

// 			this[key] =$("<table class='table table-bordered' id='sp'>\
// 				<thead><tr></tr></thead>\
// 				<tbody></tbody>\
// 			</table>").appendTo(me.field_area)

// 			$.each(columns, 
// 				function(i, col) {
// 				$("<th>").html(col[0]).css("width", col[1]+"px")
// 					.appendTo(me[key].find("thead tr"));
// 			});
// 		}

// 		this.render_data(key);
// 	},
// 	render_data: function(key){
// 		var me = this;
// 		frappe.call({
// 			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_wo_details",
// 			args:{'tab': key, 'woname': this.woname},
// 			callback: function(r){
// 				console.log(r.message)
// 				$.each(r.message, function(i, d) {	
// 					me.create_child_row(key, d)
// 				});
// 			}
// 		})
// 	},
// 	add_row:function(key){
// 		var me = this;
// 		me.create_child_row(key)
// 	},
// 	create_child_row: function(key, dic){
// 		var me = this;

// 		if(key == 'Work Order') {
// 			$.each(dic, function(key, val){
// 				console.log([key, val])
// 				$('[data-fieldname="'+key+'"]').attr("disabled","disabled")
// 				$('[data-fieldname="'+key+'"]').val(val)
// 			})
// 		};

// 		var row = $("<tr>").appendTo(me[key].find("tbody")[0]);

// 		if(key == 'Style Transactions'){
// 			if(!dic){
// 				dic = {'field_name': $('[data-fieldname="field_name"]').val(), 'abbreviation': ''} 
// 			}
// 			$("<td>").html(dic['field_name']).appendTo(row);
// 			$("<td>").html('<input type="Textbox" class="text_box">').appendTo(row);
// 			$("<td>").html(dic['abbreviation']).appendTo(row);
// 			$("<td>").appendTo(row);
// 			$('<button  class="remove">View</button>').appendTo($("<td>")).appendTo(row)
// 				.click(function(){
// 					me.view_style($(this).closest("tr").find('td'), me[key].find("tbody"))
// 				});
// 			$('<button  class="remove"><i class="icon-trash"></i></button>').appendTo($("<td>")).appendTo(row)
// 				.click(function(){
// 					$(this).parent().remove()
// 			});
// 		}
// 		else if(key == 'Measurement Item'){
// 			if(!dic){
// 				dic = {
// 					'parameter': $('[data-fieldname="parameter"]').val(), 
// 					'abbreviation': $('[data-fieldname="abbreviation"]').val(),
// 					'value': $('[data-fieldname="value"]').val()
// 				} 
// 			}
// 			$("<td>").html(dic['parameter']).appendTo(row);
// 			$("<td>").html(dic['abbreviation']).appendTo(row);
// 			$('<input type="text" class="text_box">').appendTo($("<td>")).appendTo(row)
// 				.focusout(function(){
// 					me.calc_measurement($(this).closest("tbody").find('tr'), $(this).closest("tr").find('td'), $(this).val())
// 				})
// 				.val(dic['value'])
// 			$('<button  class="remove"><i class="icon-trash"></i></button>').appendTo($("<td>")).appendTo(row)
// 				.click(function(){
// 					$(this).parent().remove()
// 			});
// 		}
// 	},
// 	view_style:function(col_id, tab){
// 		var style_name = $(col_id[0]).text();
// 		var image_data;
		
// 		var me1 = this;
// 		var dialog = new frappe.ui.Dialog({
// 				title:__(style_name+' Styles'),
// 				fields: [
// 					{fieldtype:'HTML', fieldname:'styles_name', label:__('Styles'), reqd:false,
// 						description: __("")},
// 						{fieldtype:'Button', fieldname:'create_new', label:__('Ok') }
// 				]
// 			})
// 		var fd = dialog.fields_dict;
// 	        return frappe.call({
// 				type: "GET",
// 				method: "tools.tools_management.custom_methods.get_styles_details",
// 				args: {
// 					"item": $('[data-fieldname="item_code"]').val(),
// 					"style": style_name 
// 				},
// 				callback: function(r) {
// 					if(r.message) {
						
// 						var result_set = r.message;
// 						this.table = $("<table class='table table-bordered'>\
// 	                       <thead><tr></tr></thead>\
// 	                       <tbody></tbody>\
// 	                       </table>").appendTo($(fd.styles_name.wrapper))

// 						columns =[['Style','10'],['Image','40'],['Value','40']]
// 						var me = this;
// 						$.each(columns, 
// 	                       function(i, col) {                  
// 	                       $("<th>").html(col[0]).css("width", col[1]+"%")
// 	                               .appendTo(me.table.find("thead tr"));
// 	                  }	);
						
// 						$.each(result_set, function(i, d) {
// 							var row = $("<tr>").appendTo(me.table.find("tbody"));
// 	                       $("<td>").html('<input type="radio" name="sp" value="'+d[0]+'">')
// 	                       		   .attr("style", d[0])
// 	                               .attr("image", d[1])
// 	                               .attr("value", d[2])
// 	                               .attr("abbr", d[3])
// 	                               .attr("customer_cost", d[4])
// 	                               .attr("tailor_cost", d[5])
// 	                               .attr("extra_cost", d[6])
// 	                               .appendTo(row)
// 	                               .click(function() {
// 	                               		  $(col_id[3]).html($(this).attr('image'))

// 	                               		  me1.style_details[style_name] = {
// 	                               		  	'style': d[0],
// 	                               		  	"image": d[1],
// 	                               		  	"value": d[2],
// 	                               		  	"abbr": d[3],
// 	                               		  	"customer_cost": d[4],
// 	                               		  	"tailor_cost": d[5],
// 	                               		  	"extra_cost": d[6]
// 	                               		  }
// 	                               		   console.log(me1.style_details)
// 	                               });
	                     
// 	                       $("<td>").html($(d[1]).find('img')).appendTo(row);
// 	                       $("<td>").html(d[2]).appendTo(row);                    
// 	               });
						
// 						dialog.show();
// 						$(fd.create_new.input).click(function() {						
// 							refresh_field('wo_style')	
// 							dialog.hide()
// 						})
// 					}
// 				}
// 			})	
// 	},
// 	calc_measurement: function(tr, td, value){
// 		console.log(this.style_details)
// 		var measurement_details = []
// 		var param_args = {'parameter':$(td[0]).text(), 'value':value, 
// 			'item':$('[data-fieldname="item_code"]').val()}

// 		$.each(tr, function(d,i){
// 			measurement_details.push({'value':$(i).find('.text_box').val(),'parameter': $($(i).find('td')[0]).text()})
// 		})
		
// 		frappe.call({
// 			method:"erpnext.manufacturing.doctype.work_order.work_order.apply_measurement_rules",
// 			args:{'measurement_details': measurement_details, 'param_args':param_args},
// 			callback:function(r){
// 				$.each(tr, function(d,i){
// 					for(key in r.message){
// 						if($($(i).find('td')[0]).text() == r.message[key]['parameter'])
// 							$(i).find('.text_box').val(r.message[key]['value'])
// 					}
// 				})
// 			}
// 		})
// 	},
// 	update_wo: function(){
// 		var me = this;
// 		this.wo_details = {};
	
// 		var wo_details_list = []
// 		me['Measurement Item'].find('tr').each(function (tr_id, tr_val) {
// 			if(tr_id != 0){
// 				var $tds = $(this).find('td')
// 				var values = [];
// 				for(i=0; i< $tds.length; i++){
// 					values.push($tds.eq(i).text())
// 				}
// 				values.push($tds.closest('tr').find('.text_box').val())
// 				wo_details_list.push(values)
// 			}	
// 		})
// 		me.wo_details['Measurement Item'] = wo_details_list
		
// 		frappe.call({
// 			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.update_wo",
// 			args:{'wo_details': me.wo_details, 'style_details':me.style_details, 'fields':me.field_list, 'woname': me.woname},
// 			callback: function(r){
// 				// new frappe.SalesInvoce(me.wrapper)
// 			}
// 		})
// 	}
// })


frappe.pages['sales-dashboard'].onload = function(wrapper) {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Sales Dashboard',
		single_column: true
	});
	console.log($(this))
	console.log($(wrapper).find(".layout-main"))
	// $(document).find('div.appframe container').css('width','inherit');
	$('.container').css('width', 'inherit');
	$(document).find('div.layout-main').css('width','inherit');
	$(wrapper).find(".layout-main").html("<div class='user-settings'></div>\
	<table  width = '100%'>\
		<tr><td bgcolor = '#FAFBFC' style='padding:0; margin:0;border-spacing: 0;width:25%'><div id= 'customer' width='100%'></div></td>\
			<td  rowspan='2' valign='top' style='width:75%'><div id= 'result_area' style ='height:600px;overflow-y:auto;'  ></div></td>\
		</tr>\
		<tr><td bgcolor = '#FAFBFC' style='z-index: -1; width:25%'><div id= 'sales_invoice'></td></tr>\
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
		$(this.wrapper).find('#customer').html("<h3>1. Customer</h3>")
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

		this.table = $("<table   class='table table-bordered' style='height:50px;table-layout:fixed'>\
			<thead><tr></tr></thead>\
			<tbody style='display: block;height:150px;overflow-y: hidden;'></tbody>\
		</table>").appendTo(this.customer_tab);

		this.table.find("tbody").hover(function(){
  			  $(this).css('overflow-y','auto')
  			}, function(){
    			$(this).css('overflow-y','hidden')
    		}
  		)

		$.each(columns, 
			function(i, col) {
			$("<th>").html(col['name']).css("width", col[1]+"%").css("align","center")
				.appendTo(me.table.find("thead tr"));
		});

		$.each(customers_list, 
			function(i, cust) {
			var row = $("<tr id="+i+">").appendTo(me.table.find("tbody"));
			$("<td>").html(cust['name']).appendTo(row).click(function(){
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
		$(this.wrapper).find("#sales_invoice").html("<h3>2. Sales Invoice</h3>")
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

		columns = [[frappe._("Sales Invoice"), 100]];

		this.table = $("<table  style='table-layout:fixed' class='table table-bordered'>\
			<thead><tr></tr></thead>\
			<tbody style='display: block;height:150px;overflow-y: hidden;'></tbody>\
		</table>").appendTo(this.si_tab);

		this.table.find("tbody").hover(function(){
  			  $(this).css('overflow-y','auto')
  			}, function(){
    			$(this).css('overflow-y','hidden')
    		}
  		)

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
				me.add_worklist($(this).text(), row)
				new frappe.SalesForm(me.wrapper, 'open', '',$(this).text())
			})

		});
	},
	add_worklist:function(si_num, td){
		console.log(['test', si_num])
		var me = this;
		this.si_td = td;
		$('.btn-default').remove();
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_work_orders",
			args:{'si_num': si_num},
			callback:function(r){
				$.each(r.message, function(i, workorder){
					$("<button class='btn btn-small btn-default'><i class='icon-search'></i>"+workorder+"</button>")
					.appendTo($(me.si_td))
					.click(function(){
						new frappe.WOForm(me.wrapper, $(this).text())
					})
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

		$("<button class='btn btn-small btn-info'><i class='icon-search'></i></button>")
			.appendTo($("<td>").appendTo(row))
			.click(function() {
				if($(me.area).attr('id') == 'customer')
					new frappe.Customer(me.wrapper, $(me.area).find('.form-control').val())
				if($(me.area).attr('id') == 'sales_invoice')
					new frappe.SalesInvoce(me.wrapper, $(me.area).find('.form-control').val())
			});

		$("<button class='btn btn-small btn-info'><i class='icon-plus'></i></button>")
			.appendTo($("<td>").appendTo(row))
			.click(function() {
				if($(me.area).attr('id') == 'customer')
					new frappe.CustomerForm(me.wrapper, 'new')
				if($(me.area).attr('id') == 'sales_invoice')
					new frappe.SalesForm(me.wrapper, 'new', me.search_key, '')
			});

		if($(me.area).attr('id') == 'customer'){
			frappe.call({
				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_autocomplete_list",
				args:{'search_key': this.search_key},
				callback: function(r){
					$($(me.area).find('.form-control')).autocomplete({
						source: function(request, response){
							var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
							response( $.grep( r.message, function( value ) {
								console.log(value)
								return matcher.test(value['customer_name']) || matcher.test(value.email) || matcher.test(value.mobile_no);
							}));
						},
						select: function( event, ui ) {
							new frappe.Customer(me.wrapper, $(me.area).find('.form-control').val())
							new frappe.CustomerForm(me.wrapper, 'open', $(me.area).find('.form-control').val())
							new frappe.SalesInvoce(me.wrapper,$(me.area).find('.form-control').val())
						}
					});
					// new frappe.SalesInvoce(me.wrapper,me.search_key)
				}
			})
		}
	}

})

frappe.CustomerForm = Class.extend({
	init: function(wrapper, form_type, customer){
		this.wrapper = wrapper;

		this.field_list = {
			'Basic Info':[
				['Full Name', 'Data', '','customer_name'], 
				['Customer Group', 'Link', 'Customer Group', 'customer_group'], 
				['Type','Select','\nCompany\nIndividual','customer_type'], 
				['Territory', 'Link', 'Territory', 'territory']],
			'Contact Details':[
				['Mobile', 'Data', '', 'mobile_no'], 
				['Email Id','Data', '', 'email_id'], ],
			'Full Body Measurement Details':[
				['Parameter', 'Link', 'Measurement', 'parameter'],
				['Value', 'Data', '', 'value']]
		}

		if(form_type == 'new')
			this.render_customer_form(form_type);

		if(form_type == 'open')
			this.open_record(customer);

	},
	render_customer_form: function(form_type){
		var me = this;
		$('#result_area').empty()
		this.field_area = $(this.wrapper).find('#result_area')
		$.each(this.field_list, 
			function(i, field) {
				me.table = $("<table style='width:100%;table-layout:fixed'>\
						<tbody style='width:100%;'></tbody>\
						</table>").appendTo(me.field_area);
				me.render_child(field, form_type, i)

		})

		var row = $("<tr>").appendTo(me.table.find("tbody"));
		if(form_type == 'new'){
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%' ><i class='icon-plus'></i></button>")
			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
			.click(function() {
				me.add_body_measurement()
			});

			this.table1 = $("<table class='table table-bordered'>\
				<thead><tr></tr></thead>\
					<tbody '></tbody>\
				</table>").appendTo(this.table.find('tbody'));

			columns = [["Parameter",50], ["Value", 100]];
			
			$.each(columns, 
					function(i, col) {
					$("<th>").html(col[0]).css("width", col[1]+"px")
						.appendTo(me.table1.find("thead tr"));
			});
			
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
			.appendTo($("<td colspan='2' align='center'>").appendTo($('#result_area')))
			.click(function() {
				me.create_customer()
			});
		}
		else{
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-folder-open'></i> Open </button>")
			.appendTo($("<td colspan='2' align='center'>").appendTo($('#result_area')))
			.click(function() {
				window.open("#Form/Customer/"+form_type, "_self");
			});


			
		}
		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%").css("width","100%")
	},

	render_child: function(fields, form_type, key){
		var me = this;
		
		$('<h4 class="col-md-12" style="margin: 0px 0px 15px; width:300px">\
			<i class="icon-in-circle icon-user"></i>\
			<span class="section-count-label"></span>.'+key+'.</h4>').prependTo(me.table)
		if(key!='Basic Info' && key!='Full Body Measurement Details' ){
			$('<hr style="border: 2px solid #CBCACA"></hr>').insertBefore(me.table)
		}

		var row = $("<tr width:'100%'>").appendTo(me.table.find("tbody"));
		var count=0
		$.each(fields, 
			function(i, field) {
				console.log(i)
				console.log(field)
				if (count==3){
                    row = $("<tr width:'100%' >").appendTo(me.table.find("tbody"));
                    count=0
                    }
				
				if(field[0]=='Full Name' || field[0]=='Mobile' || field[0]=='Customer Group' || field[0]=='Type' || field[0]=='Email Id' || field[0]=='Address Line 1' || field[0]=='City' || field[0]=='Territory' ){
                     var td = $("<td  style='width:33%'>").appendTo(row)
                     $(td).html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%;display:inline-block">'+field[0]+'</label><label class="mandatory">*</label>').appendTo(row);
						frappe.ui.form.make_control({
							df: {
							    "fieldtype": field[1],
								"fieldname": field[3],
								"options": field[2],
								"label": field[0]
								},
							parent:td,
						}).make_input();
				}else{
					var td = $("<td style='width:33%'>").appendTo(row)

					$(td).html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%;display:inline-block">'+field[0]+'</label>').appendTo(row);
					
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
				
				
                count=count+1  ;
			})
			
			if(key=='Full Body Measurement Details'){
				console.log("In hide")
				$(me.table).hide();

			}
		
		    if(form_type=='new'){
		    	console.log("in new");
		    	$('[data-fieldname="customer_type"]').val("Individual").prop('selected', true)
		    	frappe.call({
		    		method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_default_values",
		    		callback:function(r){
		    			if(r.message){
		    				$('[data-fieldname="customer_group"]').attr("value",r.message[0])
		    				$('[data-fieldname="territory"]').attr("value",r.message[1])

		    			}

		    		}




		    	});

		    }
 
		$( "label" ).remove( ".col-xs-4" );
		$('.mandatory').css({'color':'red','padding-left':'5px'});
		$( "div.col-xs-8" ).addClass( "col-xs-12" )
		$( "div" ).removeClass( "col-xs-8" );
		$( "div.col-xs-12" ).css('padding','2%');
	},
	add_body_measurement:function(){
		row = $('<tr>').appendTo(this.table1.find('tbody')[0])
		$('<td>').html($('[data-fieldname="parameter"]').val()).appendTo(row);
		$('<td>').html($('[data-fieldname="value"]').val()).appendTo(row);

	},
	create_customer: function(){
		var me = this;
		this.cust_details = {};
		$.each(this.field_list, function(key, field) {
			if(key!='Full Body Measurement Details'){
				$.each(field, function(id, values){
					me.cust_details[values[3]] = $('[data-fieldname="'+values[3]+'"]').val()
				})
			}
			else{
				me.cust_details[key] = [];
				me.table1.find('tr').each(function (tr_id, tr_val) {
					var $tds = $(tr_val).find('td')
					if($tds.length != 0){
						measurement_details = {}
						measurement_details['parameter'] = $tds.eq(0).text();
						measurement_details['value'] = $tds.eq(1).text();
						me.cust_details[key].push(measurement_details)
					}
				})

			}
		})
		console.log(this.cust_details)
		if(this.cust_details.customer_name!="" && this.cust_details.customer_group!="" && this.cust_details.customer_type!="" && this.cust_details.territory!="" && this.cust_details.mobile_no!="" && this.cust_details.email_id!="" ){
                console.log("in if")
				frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.create_customer",
			args:{'cust_details': this.cust_details},
			callback: function(r){
				new frappe.Customer(me.wrapper)
			}
		})	

		}else{
			alert("Please enter all mandatory fields")
		}
	},
	open_record: function(customer){
		var me = this;
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_cust_details",
			args:{'customer': customer},
			callback: function(r){
				me.render_customer_form(customer)
				$.each(r.message, function(key, val){

					$('[data-fieldname="'+key+'"]').attr("disabled","disabled")
					$('[data-fieldname="'+key+'"]').attr("value", val)

					if(key=="customer_type"){
						console.log("in customer type")
						$('[data-fieldname="'+key+'"]').val(val).prop('selected', true)
					}
				})
			}
		})	
	}

})


frappe.SalesForm = Class.extend({
	init: function(wrapper, form_type, search_key, si_no){
		this.si_no = si_no;
		this.wrapper = wrapper;
		this.search_key = search_key;
		this.reservation_details = {}
		this.fabric_detail = {}
		this.split_qty_dict = {}

		this.field_list = {
			'Basic Info':[['Customer', 'Link', 'Customer','customer'], 
				['Book Date', 'Date', '', 'posting_date'], 
				['Release', 'Select', 'No\nYes', 'release']],
			'Tailoring Item Details':[
				['Delivery Date','Date','','tailoring_delivery_date',1],
				['Service', 'Link', 'Service','tailoring_price_list',1], 
				['Item Code', 'Link', 'Item','tailoring_item_code',1], 
				['Fabric Code', 'Link', 'Item','fabric_code',1],
				['Size', 'Link', 'Size','tailoring_size',1],
				['Product Qty', 'Data', '','tailoring_qty',1],
				['Width', 'Link', 'Width','width',1],
				['Fabric Qty', 'Data', '','fabric_qty',1],
				['Product Rate', 'Data', '','tailoring_rate',1],
				['Fabric Rate', 'Data', '','fabric_rate',0],
				['Total Amt', 'Data', '','tot_amt',1],
				['Delivery Branch (Tailoring)', 'Link', 'Branches', 'tailoring_branch',1],
				['Split Qty', 'Data', '', 'split_qty', 1]],
			'Merchandise Item Details':[
				['Delivery Date','Date','','merchandise_delivery_date',1],
				['Price List', 'Link', 'Price List','merchandise_price_list',1], 
				['Item Code', 'Link', 'Item','merchandise_item_code',1], 
				['Qty', 'Data', '','merchandise_qty',1],
				['Rate', 'Data', '','merchandise_rate',1],
				['Delivery Branch (Merchandise)', 'Link', 'Branches', 'merchandise_branch',1]],
			'Taxes and Charges':
				[['Taxes and Charges', 'Link', 'Sales Taxes and Charges Master', 'taxes_and_charges']],
			'Total':
				[['Total', 'Data', '', 'total'],
				 ['Grand Total', 'Data', '', 'grand_total']]
		};
		
		if(form_type == 'new')
			this.render_sales_form(form_type);

		if(form_type == 'open')
			this.open_record(si_no, form_type);

	},
	render_sales_form: function(form_type){
		var me = this;
		$('#result_area').empty()
		this.field_area = $(this.wrapper).find('#result_area')

		$.each(this.field_list, 
			function(i, field) {
				me[i+'_1'] = $("<table style='width:100%;table-layout:fixed'>\
						<tbody style='width:100%;'></tbody>\
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
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%;margin-left:40%;'><i class='icon-folder-open'></i> Open </button>")
			.appendTo(me.field_area)
			.click(function() {
				console.log(me.si_no)
				window.open("#Form/Sales Invoice/"+me.si_no, "_self");
			});
		}

		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%").css("width","100%")
	},
	render_child: function(fields, form_type, key){
		var me = this;

		$('<h4 class="col-md-12" style="margin: 0px 0px 15px; width:300px">\
			<i class="icon-in-circle icon-user"></i>\
			<span class="section-count-label"></span>.'+key+'. </h4>').prependTo(me[key+'_1'])
		if(key!='Basic Info'){
			$('<hr style="border: 2px solid #CBCACA"></hr>').insertBefore(me[key+'_1'])
		}


		var row = $("<tr width='100%'>").appendTo(me[key+'_1'].find("tbody"));
		var count=0;
		if(me.type_checker(form_type, key)){
			$.each(fields, 
				function(i, field) {

					if (count==3){
                    row =  $("<tr width='100%'>").appendTo(me[key+'_1'].find("tbody"));
                    count=0
                    }
				
				 var td = $("<td width='35%'>").appendTo(row)
                     if(field[0]!='Split Qty'){
                     
                         $(td).html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%;display:inline-block">'+field[0]+'</label>').appendTo(row); 
				      }
				        else{
				 	      $(td).css('display','None')
				         }	
				 frappe.ui.form.make_control({
							df: {
							    "fieldtype": field[1],
								"fieldname": field[3],
								"options": field[2],
								"label": field[0]
								},
							parent:td,
						}).make_input();
						count=count+1;


					if(form_type=='new' && ( field[3]=='tailoring_delivery_date' ||  field[3]=='posting_date' ||  field[3]=='merchandise_delivery_date' ) ){
						 var d = new Date();
                         console.log($.datepicker.formatDate('dd-mm-yy',d))
                        $('[data-fieldname="'+field[3]+'"]').val($.datepicker.formatDate('dd-mm-yy',d));
					}	

				})
		}

		$('[data-fieldname="split_qty"]').css('display','None');
		console.log([key, form_type])
		if(key == 'Tailoring Item Details' && form_type == 'new'){
			var row1 = $("<tr>").appendTo(me[key+'_1'].find("tbody"));
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%;'><i class='icon-save'></i> Split Qty </button>")
			.appendTo($("<td >").appendTo(row1))
			.click(function() {
				if($('[data-fieldname="tailoring_qty"]').val() && $('[data-fieldname="tailoring_item_code"]').val()){
					new frappe.SplitQty(me.wrapper, me)
				}else{
					alert("Product qty and Item Code is Mandatory Field")
				}
			});
			$("<button class='btn btn-small btn-primary' id = 'reserve_fabric' style='margin-bottom:2%;'><i class='icon-save'></i> Reserve Fabric </button>")
			.appendTo($("<td >").appendTo(row1))
			.click(function() {
				me.reserve_fabric()
			});
		}

		$( "label" ).remove( ".col-xs-4" );
		$( "div.col-xs-8" ).addClass( "col-xs-12" )
		$( "div" ).removeClass( "col-xs-8" );
		$( "div.col-xs-12" ).css('padding','2%');

		$('[data-fieldname="customer"]').val(this.search_key)

		$('[data-fieldname="fabric_code"]').change(function(){
			frappe.call({
				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_fabric_rate_and_width",
				args:{'price_list': $('[data-fieldname="tailoring_price_list"]').val(), 
					'fabric_code':$('[data-fieldname="fabric_code"]').val(),
					'item_code':$('[data-fieldname="tailoring_item_code"]').val(),
					'size':$('[data-fieldname="tailoring_size"]').val(),
					'fabric_qty':$('[data-fieldname="fabric_qty"]').val(),
					'fabric_rate':$('[data-fieldname="fabric_rate"]').val()
				},
				callback: function(r){
					$('[data-fieldname="fabric_rate"]').val(r.message.fc)
					$('[data-fieldname="tailoring_rate"]').val(r.message.ic)
					$('[data-fieldname="width"]').val(r.message.fw)
					$('[data-fieldname="fabric_qty"]').val(r.message.fq)
					me.set_tot()
				}
			})
		})

		$('[data-fieldname="tailoring_item_code"]').change(function(){
			me.clear_data('Item')
		})

		$('[data-fieldname="tailoring_size"]').change(function(){
			frappe.call({
				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_size_and_rate",
				args:{'price_list': $('[data-fieldname="tailoring_price_list"]').val(), 
					'item_code':$('[data-fieldname="tailoring_item_code"]').val(),
					'fabric_code':$('[data-fieldname="fabric_code"]').val(),
					'branch':$('[data-fieldname="branch"]').val(),
					'size': $('[data-fieldname="tailoring_size"]').val(),
					'width':$('[data-fieldname="width"]').val(),
					'fabric_qty':$('[data-fieldname="fabric_qty"]').val(),
					'fabric_rate':$('[data-fieldname="fabric_rate"]').val()
					},
				callback: function(r){
					$('[data-fieldname="tailoring_rate"]').val(r.message)
				}
			})
		})

		$('[data-fieldname="tailoring_qty"]').change(function(){
			frappe.call({
				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_fabric_qty",
				args:{'item_code':$('[data-fieldname="tailoring_item_code"]').val(),
					'width': $('[data-fieldname="width"]').val(),
					'size': $('[data-fieldname="tailoring_size"]').val()
					},
				callback: function(r){
					$('[data-fieldname="fabric_qty"]').val(flt(r.message) * flt($('[data-fieldname="tailoring_qty"]').val()))
					me.set_tot()
				}
			})
		})

		$('[data-fieldname="fabric_code"]').change(function(){
			frappe.call({
				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.check_swatch_group",
				args:{'fabric_code':$('[data-fieldname="fabric_code"]').val()},
				callback: function(r){
					if(r.message == 1){
						$('#reserve_fabric').hide()
					}
					else{
						$('#reserve_fabric').show()	
					}
				}
			})
		})

		$('[data-fieldname="tailoring_rate"]').change(function(){
			me.set_tot()
		})

		$('[data-fieldname="fabric_rate"]').change(function(){
			me.set_tot()
		})

		$('[data-fieldname="merchandise_item_code"]').change(function(){
			frappe.call({
				method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_merchandise_item_price",
				args:{'price_list': $('[data-fieldname="merchandise_price_list"]').val(), 
					'item_code':$('[data-fieldname="merchandise_item_code"]').val()},
				callback: function(r){
					$('[data-fieldname="merchandise_rate"]').attr('value', r.message)
				}
			})
		})

		if(key!='Basic Info' && key != 'Total' && key != 'Taxes and Charges'){
			if(key == 'Tailoring Item Details')
				columns = [["Delivery Date",50], ["Price List",50], ["Item Code", 100], ["Fabric Code", 100], ["Size", 100], ["Prod. Qty", 100],["Width", 100], ["Fabric Qty", 100], ['Prod. Rate', 100], ['Tot Amt', 100], ['Tailoring Branch', 100], ['', 50]];
			
			if(key == 'Merchandise Item Details')
				columns = [["Delivery Date",50], ["Price List",50], ["Item Code", 100], ["Qty", 100], ['Rate', 100], ['Merchandise Branch', 100],['', 50]];
			
			// if(key == 'Taxes and Charges')
			// 	columns = [["Price List",50], ["Item Code", 100], ["Qty", 100], ['Rate', 100], ['Merchandise Branch', 100]];

			if(form_type == 'new'){
				if(key == 'Tailoring Item Details'){
					$("<button class='btn btn-small btn-primary' style='margin-bottom:2%' id='"+key+"'>Add To Merchandise</button>")
					.appendTo($("<td >").appendTo(row))
					.click(function() {

						fab_details = {
							'delivery_date': $('[data-fieldname="tailoring_delivery_date"]').val(),
							'price_list': $('[data-fieldname="tailoring_price_list"]').val(),
							'item_code': $('[data-fieldname="fabric_code"]').val(),
							'qty': $('[data-fieldname="fabric_qty"]').val(),
							'rate': $('[data-fieldname="fabric_rate"]').val(),
							'branch': $('[data-fieldname="tailoring_branch"]').val()
						}

						$('[data-fieldname="tailoring_rate"]').val( flt($('[data-fieldname="tailoring_rate"]').val()) - flt($('[data-fieldname="fabric_rate"]').val()) * flt($('[data-fieldname="fabric_qty"]').val()) / flt($('[data-fieldname="tailoring_qty"]').val()))

						$('[data-fieldname="tot_amt"]').val(flt($('[data-fieldname="tailoring_qty"]').val()) * flt($('[data-fieldname="tailoring_rate"]').val()))
						
						var row = $("<tr>").appendTo(me['Merchandise Item Details'].find("tbody"));
						$.each(fab_details, function(i, d) {	
							$("<td>").html(d).appendTo(row);
						});

						$('<button  class="remove"><i class="icon-trash"></i></button>').appendTo($("<td>")).appendTo(row)
							.click(function(){
								$(this).parent().remove()
								me.calc_total_amt()
								$('[data-fieldname="split_qty"]').val('')
							});
					});

		             $("<button  align='center' class='btn btn-small btn-primary' style='margin-bottom:2%' id='"+key+"'><i class='icon-plus'></i></button>")
					.appendTo($("<tr align='center'>").appendTo(row))
					.click(function() {
						status = 'true'
						if(key == 'Tailoring Item Details'){
							status = me.AddDataValidation()
						}else{
							status = me.AddDataValidationMerchandise()
						}
						if(status == 'true'){
							me.add_row($(this).attr('id'))
							me.clear_data('Plus')
						}
					   });
				}
				else{

					$("<button  align='center' class='btn btn-small btn-primary' style='margin-bottom:2%' id='"+key+"'><i class='icon-plus'></i></button>")
				.appendTo($("<tr align='center'>").insertAfter(row))
				.click(function() {
					status = 'true'
					if(key == 'Tailoring Item Details'){
						status = me.AddDataValidation()
					}else{
						status = me.AddDataValidationMerchandise()
					}
					if(status == 'true'){
						me.add_row($(this).attr('id'))
						me.clear_data('Plus')
					}
				});


				}

				
			}

			this[key] =$("<table class='table table-bordered;table-layout:fixed'  style='width:100%' id='sp'>\
				<thead style='width:100%'><tr style='width:100%'></tr></thead>\
				<tbody style='width:100%'></tbody>\
			</table>").appendTo(me.field_area)

			$.each(columns, 
				function(i, col) {
				$("<th>").html(col[0]).css("width", col[1]+"px")
					.appendTo(me[key].find("thead tr"));
			});
		}
		
	},
	clear_data:function(type){
		var me = this;
		data = ['fabric_code','tailoring_size', 'tailoring_qty', 'width', 'fabric_qty', 'fabric_rate', 'tot_amt', 'tailoring_branch', 'split_qty', 'tailoring_rate', 'tailoring_price_list', 'tailoring_item_code']
		if (type == 'Item'){
			data = ['fabric_code','tailoring_size', 'tailoring_qty', 'width', 'fabric_qty', 'fabric_rate', 'tot_amt', 'tailoring_branch', 'split_qty', 'tailoring_rate']
		}

		$.each(data, function(i){
			$('[data-fieldname="'+data[i]+'"]').val("")	
		})
		
	},
	//Rohit
	AddDataValidation: function(){
		var me = this;
		msg = "true"
		data = {'tailoring_delivery_date':'Delivery Date','tailoring_item_code':'Item Code','fabric_code': 'Fabric Code','tailoring_size': 'Size', 'tailoring_qty':'Product Qty', 'width': 'Width', 'fabric_qty':'Fabric Qty', 'fabric_rate': 'Fabric Rate', 'tot_amt': 'Total Amt', 'tailoring_branch':'Delivery Branch', 'tailoring_rate':'Tailoring Rate', 'tailoring_delivery_date':'Delivery Date', 'tailoring_price_list':'Service'}
		$.each(data, function(i, d){
			if(!$('[data-fieldname="'+i+'"]').val()){
				alert('Mandatory Field: '+d)
				msg = "false"
				return false
			}
		})
		return msg
	},
	AddDataValidationMerchandise : function(){
		var me = this;
		msg = "true"
		data = {'merchandise_delivery_date':'Merchandise Delivery Date','merchandise_item_code':'Merchandise Item Code', 'merchandise_price_list':'Merchandise Price List', 'merchandise_qty':'Product Qty','merchandise_branch':'Delivery Branch', 'merchandise_rate':'Tailoring Rate'}
		$.each(data, function(i, d){
			if(!$('[data-fieldname="'+i+'"]').val()){
				console.log(i)
				console.log($('[data-fieldname="'+i+'"]').val())
				alert('Mandatory Field: '+d)
				msg = "false"
				return false
			}
		})
		return msg	
	},
	set_tot:function(){				
		$('[data-fieldname="tot_amt"]').attr("disabled","disabled")
		$('[data-fieldname="fabric_qty"]').attr("disabled","disabled")
		$('[data-fieldname="width"]').attr("disabled","disabled")
		$('[data-fieldname="tot_amt"]').val(flt($('[data-fieldname="tailoring_qty"]').val()) * flt($('[data-fieldname="tailoring_rate"]').val()))
	},
	type_checker:function(form_type, key){
		if(form_type == 'new')
			return true;
		else if(form_type == 'open'){
			if(key == 'Basic Info' || key == 'Total')
				return	 true;
			else
				return false;
		}
	},
	add_row:function(key){
		var me = this;
		this.tailoring_item_details = {};
		this.retrive_data(this.field_list[key])

		var row = $("<tr>").appendTo(me[key].find("tbody"));
		
		$.each(this.tailoring_item_details, function(i, d) {	
			if(i=='split_qty' && d){
				$("<td style='display:none'>").html(d).appendTo(row);	
			}
			else{
				$("<td>").html(d).appendTo(row);	
			}
		});
		// if(key == 'Tailoring Item Details')
		// 	$("<td>").html(me.split_qty_dict).appendTo(row)

		$('<button  class="remove"><i class="icon-trash"></i></button>').appendTo($("<td>")).appendTo(row)
				.click(function(){
					delete me.reservation_details[$(this).parent().find('td:eq(2)').text()]
					$(this).parent().remove()
					me.calc_total_amt()
				});
		me.calc_total_amt()
	},
	retrive_data: function(fields){
		var me = this;
		$.each(fields, function(i, field) {
			if(field[4]==1){
				me.tailoring_item_details[field[3]] = $('[data-fieldname="'+field[3]+'"]').val()
			}
		})	
	},
	reserve_fabric: function(){
		var me1 = this;
		console.log($('[data-fieldname="fabric_qty"]').val())
		// console.log(e)
		var image_data;
		var dialog = new frappe.ui.Dialog({
				title:__('Fabric Details'),
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
				method: "tools.tools_management.custom_methods.get_warehouse_wise_stock_balance",
				args: {
					"item": $('[data-fieldname="fabric_code"]').val(),
					"qty": $('[data-fieldname="fabric_qty"]').val()
				},
				callback: function(r) {
					if(r.message) {
						var result_set = r.message;
						this.table = $("<table class='table table-bordered'>\
	                       <thead><tr></tr></thead>\
	                       <tbody></tbody>\
	                       </table>").appendTo($(fd.styles_name.wrapper))

						columns =[['Branch','40'],['Qty','40'], ['Reserv Qty', 50], ['','10'],]
						var me = this;
						$.each(columns, 
	                       function(i, col) {                  
	                       $("<th>").html(col[0]).css("width", col[1]+"%")
	                               .appendTo(me.table.find("thead tr"));
	                  }	);
						
						$.each(result_set, function(i, d) {
							console.log(d)
							var row = $("<tr>").appendTo(me.table.find("tbody"));
	                       $("<td>").html(d[2]).appendTo(row);
	                       $("<td>").html(d[1]).appendTo(row); 
	                       $("<td>").html('<input type="Textbox" class="text_box">').appendTo(row);    
	                       $("<td>").html('<input type="checkbox" name="sp" value="'+d[0]+'">')
	                       		   .attr("style", d[0])
	                               .attr("image", d[1])
	                               .appendTo(row)
	                               .click(function() {
	                                      if($(this).find('input[type="checkbox"]').is(':checked') == true){
	                               			if(me1.fabric_detail[d[2]]){
	                                      	me1.fabric_detail[d[2]].push([$('[data-fieldname="fabric_code"]').val(), $(this).closest("tr").find('.text_box').val(), $('[data-fieldname="tailoring_item_code"]').val()])
	                                      }
	                                      else{
	                                      	me1.fabric_detail[d[2]] = []
	                                       	me1.fabric_detail[d[2]].push([$('[data-fieldname="fabric_code"]').val(), $(this).closest("tr").find('.text_box').val(), $('[data-fieldname="tailoring_item_code"]').val()])
	                                       }	
	                               		}else{
	                               			delete me1.fabric_detail[d[2]]
	                               		}
	                               });               
	               });
						
						dialog.show();
						$(fd.create_new.input).click(function() {
							if(parseInt(me1.fabric_detail.length)>1){
								me1.reservation_details[$('[data-fieldname="tailoring_item_code"]').val()] = JSON.stringify(me1.fabric_detail)			
							}						
							dialog.hide()
						})
					}else{
						alert("Stock is not available for selected fabric")
					}
				}
			})	
	},
	create_si: function(){
		var me = this;
		this.invoce_details = {};
		$.each(this.field_list, function(tab_name, fields){
			if(tab_name != 'Basic Info' && tab_name != 'Total' && tab_name != 'Taxes and Charges'){
				var si_details_list = []
				console.log(tab_name)
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
			args:{'si_details': me.invoce_details, 'fields':me.field_list, 'reservation_details': JSON.stringify(me.reservation_details)},
			callback: function(r){
				console.log(r.message)
				// new frappe.SalesInvoce(me.wrapper)
				me.open_record(r.message, 'open')
			}
		})
	},
	render_tax_struct:function(tax_struct){
		var me = this;
		console.log(me['Taxes and Charges_1'])
		console.log(me['Taxes and Charges_1'].find('tbody'))
		me['Taxes and Charges_1'].append(tax_struct)
	},
	open_record:function(si_no, form_type){
		var me = this;
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_si_details",
			args:{'name': si_no},
			callback: function(r){
				me.si_no = si_no
				me.render_sales_form(form_type)
				me.add_values(r.message)
				me.render_tax_struct(r.message['tax_details'])
				me.calc_total_amt(r.message['tot'])
			}
		})
	},
	add_values:function(si_details){
		console.log(si_details['si'])
		var me = this;

		//Render Basic Details 
		$.each(si_details['si'], function(key, value){
			$.each(value, function(key, val){
				$('[data-fieldname="'+key+'"]').attr("disabled","disabled")
				$('[data-fieldname="'+key+'"]').val(val)
			})
		})	

		//Render Tailoring Item Details
		$.each(si_details['tailoring_item'], 
				function(i, values) {
				var row = $("<tr>").appendTo(me['Tailoring Item Details'].find("tbody"));
				$.each(values, function(i, d) {	
					$("<td>").html(d).appendTo(row);
				});
			});

		//Render Merchandise Item Details
		$.each(si_details['merchandise_item'], 
				function(i, values) {
				var row = $("<tr>").appendTo(me['Merchandise Item Details'].find("tbody"));
				$.each(values, function(i, d) {	
					$("<td>").html(d).appendTo(row);
				});
			});

	},
	calc_total_amt: function(grand_total){
		// console.log('test')
		var total = 0.0;
		var me = this ;
		me['Tailoring Item Details'].find('tr').each(function (tr_id, tr_val) {
			if(tr_id != 0){
				var $tds = $(this).find('td')
				sub_tot = flt($tds.eq(9).text())
				total += sub_tot
			}	
		})

		me['Merchandise Item Details'].find('tr').each(function (tr_id, tr_val) {
			if(tr_id != 0){
				var $tds = $(this).find('td')
				sub_tot = flt($tds.eq(3).text()) * flt($tds.eq(4).text())
				total += sub_tot
			}	
		})
		
		$('[data-fieldname="total"]').attr("disabled","disabled")
		$('[data-fieldname="total"]').val(total)

		$('[data-fieldname="grand_total"]').attr("disabled","disabled")
		$('[data-fieldname="grand_total"]').val(grand_total?grand_total:total)
	}

})


frappe.SplitQty =  Class.extend({
    init : function(wrapper, si){
        // this.data = locals[cdt][cdn]
        this.split_init()
        this.si = si
    },

    split_init: function(){
        this.make_structure()
        // this.render_split_data()
        this.add_new_split_data()
        this.save_data()
        this.remove_qty()
    },

    make_structure: function(){
            this.dialog = new frappe.ui.Dialog({
                title:__(' Styles'),
                fields: [
                {fieldtype:'Int', fieldname:'qty', label:__('Qty'), reqd:false,
                        description: __("")},
                        {fieldtype:'Button', fieldname:'add_qty', label:__('Add'), reqd:false,
                        description: __("")},
                    {fieldtype:'HTML', fieldname:'styles_name', label:__('Styles'), reqd:false,
                        description: __("")},
                        {fieldtype:'Button', fieldname:'create_new', label:__('Ok') }
                ]
            })
            this.fd = this.dialog.fields_dict;
            this.div = $('<div id="myGrid" style="width:100%;height:200px;margin:10px;overflow-y:scroll">\
                        <table class="table table-bordered" style="background-color: #f9f9f9;height:10px;table-layout:fixed" id="mytable">\
                        <thead><tr><td>Item</td><td>Qty</td><td>Remove</td></tr>\
                        </thead><tbody></tbody></table></div>').appendTo($(this.fd.styles_name.wrapper))
            this.dialog.show()
    },

    render_split_data: function(){
        var me = this;
        if(this.si.split_qty_dict){
            column = JSON.parse(this.si.split_qty_dict)
            $.each(column, function(i){
                this.table = $(me.div).find('#mytable tbody').append('<tr><td style="background-color:#FFF">'+column[i].tailoring_item_code+'</td><td style="background-color:#FFF"><input type="Textbox" class="text_box" value="'+column[i].qty+'"></td><td>&nbsp;<button  class="remove">X</button></td></tr>')
            })
        }
    },

    add_new_split_data: function(){
        var me = this;
        $(this.fd.add_qty.input).click(function(){
            if(me.fd.qty.last_value){
                this.table = $(me.div).find('#mytable tbody').append('<tr><td style="background-color:#FFF">'+$('[data-fieldname="tailoring_item_code"]').val()+'</td><td style="background-color:#FFF"><input type="Textbox" class="text_box" value="'+me.fd.qty.last_value+'"></td><td>&nbsp;<button  class="remove">X</button></td></tr>')
                me.remove_qty()                
            }    
        })
        
    },

    save_data: function(){
        var me =this;
        $(this.fd.create_new.input).click(function(){
            me.split_dict={}
            var sum = 0
            $(me.div).find('#mytable tbody tr').each(function(i){
                var key = ['tailoring_item_code', 'qty', 'cancel'];
                var qty_data={}
                cells = $(this).find('td')
                $(cells).each(function(i){
                    qty_data[key[i]] = $(this).find('.text_box').val() || $(this).text();
                    val = parseInt($(this).find('.text_box').val())
                    if(val){
                        sum += val;
                    }
                })
                me.split_dict[i] = qty_data
            })
            me.validate_data(sum)
            $('[data-fieldname="split_qty"]').val(JSON.stringify(me.split_dict))
        })
    },

    validate_data: function(qty){
        var me = this;
        if(parseInt(qty)==parseInt($('[data-fieldname="tailoring_qty"]').val())) {
            this.si.split_qty_dict = JSON.stringify(me.split_dict)
            refresh_field('sales_invoice_items_one')
            console.log(this.si.split_qty_dict)
            me.dialog.hide()
        }else{
            alert("Split qty should be equal to Taiiloring Product Qty")
            me.dialog.show()
        }
    },

    remove_qty: function(){
        var me = this;
        $(this.div).find('.remove').click(function(){
            $(this).parent().parent().remove()
        })
    }
})




frappe.WOForm = Class.extend({
	init: function(wrapper, woname){
		this.wrapper = wrapper;
		this.woname = woname;
		this.style_details = {}
		this.field_list = {
			"Work Order":[
					['Sales Invoice No','Link','Sales Invoice','sales_invoice_no'],
					['Item code', 'Link', 'Item', 'item_code'],
					['Customer Name', 'Data', '', 'customer'],
					['Serial NO', 'Small Text', '', 'serial_no_data']
				],
			"Style Transactions":[
					['Field Name', 'Link', 'Style', 'field_name']
				],
			"Measurement Item":[
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
				me.table1 = $("<table style='width:100%;table-layout:fixed'>\
						<tbody style='width:100%;'></tbody>\
						</table>").appendTo(me.field_area);
				me.render_child(field, i)

		})

		$("<button class='btn btn-small btn-primary' style='margin-bottom:2%; margin-left:5%'><i class='icon-save'></i> Save </button>")
		.appendTo(me.field_area)
		.click(function() {
			me.update_wo()
			// window.open("#Form/Customer/"+$('[data-fieldname="customer_name"]').val(), "_self");
		});

		$("<button class='btn btn-small btn-primary' style='margin-bottom:2%;margin-left:5%'><i class='icon-folder-open'></i> Open </button>")
		.appendTo(me.field_area)
		.click(function() {
			// me.update_wo()
			window.open("#Form/Work Order/"+me.woname, "_self");
		});
	

		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%").css("width","100%")
	},
	render_child: function(fields, key){
		var me = this;

		$('<h4 class="col-md-12" style="margin: 0px 0px 15px; width:300px">\
			<i class="icon-in-circle icon-user"></i>\
			<span class="section-count-label"></span>.'+key+'. </h4>').prependTo(me.table1)
		if(key!='Work Order'){
			$('<hr style="border: 2px solid #CBCACA"></hr>').insertBefore(me.table1)
		}


		
		var row = $("<tr width='100%'>").appendTo(me.table1.find("tbody"));
		var count=0
		$.each(fields, 
			function(i, field) {


					if (count==3){
                    row =  $("<tr width='100%'>").appendTo(me.table1.find("tbody"));
                    count=0
                    }
				
				 var td = $("<td width='35%'>").appendTo(row)
                     $(td).html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%;display:inline-block">'+field[0]+'</label>').appendTo(row);
						frappe.ui.form.make_control({
							df: {
							    "fieldtype": field[1],
								"fieldname": field[3],
								"options": field[2],
								"label": field[0]
								},
							parent:td,
						}).make_input();
						count=count+1;
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
			if(key == 'Measurement Item')
				columns = [["Parameter",50], ["Abbreviation", 100], ["Value", 100]];

			this[key] =$("<table class='table table-bordered;table-layout:fixed' id='sp'>\
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
					me.create_child_row(key, d)
				});
			}
		})
	},
	add_row:function(key){
		var me = this;
		me.create_child_row(key)
	},
	create_child_row: function(key, dic){
		var me = this;

		if(key == 'Work Order') {
			$.each(dic, function(key, val){
				console.log([key, val])
				$('[data-fieldname="'+key+'"]').attr("disabled","disabled")
				$('[data-fieldname="'+key+'"]').val(val)
			})
		};

		var row = $("<tr>").appendTo(me[key].find("tbody")[0]);

		if(key == 'Style Transactions'){
			if(!dic){
				dic = {'field_name': $('[data-fieldname="field_name"]').val(), 'abbreviation': ''} 
			}
			$("<td>").html(dic['field_name']).appendTo(row);
			$("<td>").html('<input type="Textbox" class="text_box" value="'+dic['text']+'">').appendTo(row);
			$("<td>").html(dic['abbreviation']).appendTo(row);
			$("<td style='width:auto'>").html(dic['image']).appendTo(row);
			$('<button  class="remove">View</button>').appendTo($("<td>")).appendTo(row)
				.click(function(){
					me.view_style($(this).closest("tr").find('td'), me[key].find("tbody"))
				});
		}
		else if(key == 'Measurement Item'){
			if(!dic){
				dic = {
					'parameter': $('[data-fieldname="parameter"]').val(), 
					'abbreviation': $('[data-fieldname="abbreviation"]').val(),
					'value': $('[data-fieldname="value"]').val()
				} 
			}
			$("<td>").html(dic['parameter']).appendTo(row);
			$("<td>").html(dic['abbreviation']).appendTo(row);
			$('<input type="text" class="text_box">').appendTo($("<td>")).appendTo(row)
				.focusout(function(){
					me.calc_measurement($(this).closest("tbody").find('tr'), $(this).closest("tr").find('td'), $(this).val())
				})
				.val(dic['value'])
		}
	},
	view_style:function(col_id, tab){
		var style_name = $(col_id[0]).text();
		var image_data;
		
		var me1 = this;
		var dialog = new frappe.ui.Dialog({
				title:__(style_name+' Styles'),
				fields: [
					{fieldtype:'HTML', fieldname:'styles_name', label:__('Styles'), reqd:false,
						description: __("")},
						{fieldtype:'Button', fieldname:'create_new', label:__('Ok') }
				]
			})
		var fd = dialog.fields_dict;
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
						this.table = $("<table class='table table-bordered;style='table-layout:fixed'>\
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

	                               		  me1.style_details[style_name] = {
	                               		  	'style': d[0],
	                               		  	"image": d[1],
	                               		  	"value": d[2],
	                               		  	"abbr": d[3],
	                               		  	"customer_cost": d[4],
	                               		  	"tailor_cost": d[5],
	                               		  	"extra_cost": d[6]
	                               		  }
	                               		   console.log(me1.style_details)
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
	},
	calc_measurement: function(tr, td, value){
		console.log(this.style_details)
		var measurement_details = []
		var param_args = {'parameter':$(td[0]).text(), 'value':value, 
			'item':$('[data-fieldname="item_code"]').val()}

		$.each(tr, function(d,i){
			measurement_details.push({'value':$(i).find('.text_box').val(),'parameter': $($(i).find('td')[0]).text()})
		})
		
		frappe.call({
			method:"erpnext.manufacturing.doctype.work_order.work_order.apply_measurement_rules",
			args:{'measurement_details': measurement_details, 'param_args':param_args},
			callback:function(r){
				$.each(tr, function(d,i){
					for(key in r.message){
						if($($(i).find('td')[0]).text() == r.message[key]['parameter'])
							$(i).find('.text_box').val(r.message[key]['value'])
					}
				})
			}
		})
	},
	update_wo: function(){
		var me = this;
		this.wo_details = {};
	
		var wo_details_list = []
		me['Measurement Item'].find('tr').each(function (tr_id, tr_val) {
			if(tr_id != 0){
				var $tds = $(this).find('td')
				var values = [];
				for(i=0; i< $tds.length; i++){
					values.push($tds.eq(i).text())
				}
				values.push($tds.closest('tr').find('.text_box').val())
				wo_details_list.push(values)
			}	
		})
		me.wo_details['Measurement Item'] = wo_details_list
		
		// console.log($(location).attr('host'))
		// console.log([me.wo_details, me.style_details, me.field_list])
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.update_wo",
			args:{'wo_details': me.wo_details, 'style_details':me.style_details, 'fields':me.field_list, 'woname': me.woname},
			callback: function(r){
				// new frappe.SalesInvoce(me.wrapper)
			}
		})
	}
})