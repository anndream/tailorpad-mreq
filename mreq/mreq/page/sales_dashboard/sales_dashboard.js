frappe.pages['sales-dashboard'].onload = function(wrapper) {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Sales Dashboard',
		single_column: true
	});
	console.log($(this))
	$(wrapper).find(".layout-main").html("<div class='user-settings'></div>\
	<table width = '100%'>\
		<tr><td width = '40%' bgcolor = '#FAFBFC' style='padding:0; margin:0;border-spacing: 0;'><div id= 'customer' width='100%'></div></td>\
			<td width = '60%' rowspan='2' valign='top'><div id= 'result_area' style ='height:600px;width:600px;overflow-y:auto;'  ></div></td>\
		</tr>\
		<tr><td width = '40%' bgcolor = '#FAFBFC' style='z-index: -1;'><div id= 'sales_invoice'></td></tr>\
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
			'Address Details':[ 
				['Address Line 1', 'Data', '', 'address_line1'], 
				['Address Line 2', 'Data', '', 'address_line2'], 
				['City', 'Data', '', 'city']],
			'Contact Details':[
				['Mobile', 'Data', '', 'mobile_no'], 
				['Landline Number','Data', '', 'phone'], 
				['Email Id','Data', '', 'email_id'], 
				['Designation', 'Data', '', 'designation'], 
				['Date of Birth','Date', '', 'date_of_birth'], 
				['Anniversary Date', 'Date', '', 'anniversary_date']],
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
				me.table = $("<table>\
						<tbody style='display: block;width:500px;'></tbody>\
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
			.appendTo($("<td colspan='2' align='center'>").appendTo(row))
			.click(function() {
				window.open("#Form/Customer/"+$('[data-fieldname="customer_name"]').val(), "_self");
			});


			area = $('[data-fieldname="customer_name"]').closest('tbody');

			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
			.appendTo($("<td align='center'>").appendTo(area))
			.click(function() {
				$('#image_viewer').empty();
				frappe.upload.make({
					parent: $('#image_viewer'),
					args:{
						from_form: 1,
						doctype: 'Customer',
						docname: $('[data-fieldname="customer_name"]').val(),
					},
					callback: function(attachment, r) {
						console.log(attachment)
					}
				})
			});

			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%'><i class='icon-save'></i></button>")
			.appendTo($("<td align='center'>").appendTo(area))
			.click(function() {
				frappe.call({
					method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_images",
					args:{'name': $('[data-fieldname="customer_name"]').val()},
					callback:function(r){
						me.render_carousels(r.message)
					}
				})
			});
			$("<div id='image_viewer' width = '100%'></div>").appendTo(area)
		}
		$('#result_area').css('margin-left','2%').css('padding-right','2%').css('border','2px solid').css('border-color','#F2F0F0').css("padding-top","2%")
	},
	render_carousels: function(files){
		var me = this;
		$('#image_viewer').empty();


		var dialog = new frappe.ui.Dialog({
		title:__('Images'),
		fields: [{fieldtype:'HTML', fieldname:'image_name', label:__('Images'), reqd:false,
			description: __("")}
		]})

		var fd = dialog.fields_dict;

		this.img_viewer = $('<div id="banner-slide" style="height:200px; width:300px;  textAlign:center">\
		<ul class="bjqs">\
		</ul></div>').appendTo($(fd.image_name.wrapper));
		$.each(files,function(i,d) {  
			path = '/files/' + d[0]
			var row = $("<li>").appendTo(me.img_viewer.find("ul"));
			    $("<li>").html('<li><img src="'+path+'" width="500px" style = "max-width:100%;max-height:100%;vertical-align: middle;"text-align="center" title="secound caption"></li>')
			           .appendTo(me.img_viewer.find(row));
		});
		this.img_viewer.bjqs({

			height      : 500,
			width       : 500,
			responsive  : true,
			randomstart   : true
		});
		dialog.show();
	},
	render_child: function(fields, form_type, key){
		var me = this;

		$('<h4 class="col-md-12" style="margin: 0px 0px 15px;">\
			<i class="icon-in-circle icon-user"></i>\
			<span class="section-count-label"></span>.'+key+'. </h4>').prependTo(me.table)

		var row = $("<tr>").appendTo(me.table.find("tbody"));
		$.each(fields, 
			function(i, field) {
				$('<td>').html('<label class="control-label" style="align:center;margin-top:2%;margin-left:10%">'+field[0]+'</label>').appendTo(row);
				
				if(i%2 == 1){
					row = $("<tr>").appendTo(me.table.find("tbody"));
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
					row = $("<tr>").appendTo(me.table.find("tbody"));
				}
				else if(i == fields.length-1){
					row = $("<tr>").appendTo(me.table.find("tbody"));
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
	init: function(wrapper, form_type, search_key, si_no){
		this.si_no = si_no;
		this.wrapper = wrapper;
		this.search_key = search_key;
		this.reservation_details = {}
		this.fabric_detail = {}
		this.field_list = {
			'Basic Info':[['Customer', 'Link', 'Customer','customer'],
				['Currency', 'Link', 'Currency', 'currency'], 
				['Delivery Date','Date','','delivery_date'], 
				['Book Date', 'Date', '', 'posting_date'], 
				['Delivery Branch', 'Link', 'Branches', 'branch'],
				['Paased to Work Order', 'Select', '\nYes\nNo', 'authenticated']],
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
			this.open_record(si_no, form_type);

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
			$("<button class='btn btn-small btn-primary' style='margin-bottom:2%;margin-left:40%;'><i class='icon-folder-open'></i> Open </button>")
			.appendTo(me.field_area)
			.click(function() {
				console.log(me.si_no)
				window.open("#Form/Sales Invoice/"+me.si_no, "_self");
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
		if(me.type_checker(form_type, key)){
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
		}
		$( "label" ).remove( ".col-xs-4" );
		$( "div.col-xs-8" ).addClass( "col-xs-12" )
		$( "div" ).removeClass( "col-xs-8" );
		$( "div.col-xs-12" ).css('padding','2%');

		$('[data-fieldname="customer"]').val(this.search_key)

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

		$('[data-fieldname="split_qty"]').click(function(){
			var me1 = me;
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
						console.log([r.message])
						if(r.message) {
							
							var result_set = r.message;
							this.table = $("<table class='table table-bordered'>\
		                       <thead><tr></tr></thead>\
		                       <tbody></tbody>\
		                       </table>").appendTo($(fd.styles_name.wrapper))

							columns =[['','10'],['Warehouse','40'],['Qty','40']]
							var me = this;
							$.each(columns, 
		                       function(i, col) {                  
		                       $("<th>").html(col[0]).css("width", col[1]+"%")
		                               .appendTo(me.table.find("thead tr"));
		                  }	);
							
							$.each(result_set, function(i, d) {
								console.log(d)
								var row = $("<tr>").appendTo(me.table.find("tbody"));
		                       $("<td>").html('<input type="radio" name="sp" value="'+d[0]+'">')
		                       		   .attr("style", d[0])
		                               .attr("image", d[1])
		                               .appendTo(row)
		                               .click(function() {
		                                      if(me1.fabric_detail[d[2]]){
		                                      	me1.fabric_detail[d[2]].push([$('[data-fieldname="fabric_code"]').val(), $('[data-fieldname="fabric_qty"]').val(),$('[data-fieldname="tailoring_item_code"]').val()])
		                                      }
		                                      else{
		                                      	me1.fabric_detail[d[2]] = []
		                                       	me1.fabric_detail[d[2]].push([$('[data-fieldname="fabric_code"]').val(), $('[data-fieldname="fabric_qty"]').val(),$('[data-fieldname="tailoring_item_code"]').val()])
		                                       }
		                               });
		                     
		                       $("<td>").html(d[2]).appendTo(row);
		                       $("<td>").html(d[1]).appendTo(row);                    
		               });
							
							dialog.show();
							$(fd.create_new.input).click(function() {
								// doc.fabric_details = JSON.stringify(fabric_detail)
								me1.reservation_details[$('[data-fieldname="tailoring_item_code"]').val()] = JSON.stringify(me1.fabric_detail)
								// refresh_field('fabric_details')
								// e.reservation_status = 'Reserved';
								// refresh_field('reservation_status', e.name, 'sales_invoice_items_one')	
								console.log(me1.reservation_details)
								dialog.hide()
							})
						}
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
	type_checker:function(form_type, key){
		if(form_type == 'new')
			return true;
		else if(form_type == 'open'){
			if(key == 'Basic Info')
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
			$("<td>").html(d).appendTo(row);
		});
		console.log(me)
		$("<td>").html(me.reservation_details).appendTo(row);
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
	},
	open_record:function(si_no, form_type){
		var me = this;
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.get_si_details",
			args:{'name': si_no},
			callback: function(r){
				me.render_sales_form(form_type)
				me.add_values(r.message)
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
				me.table1 = $("<table>\
						<tbody style='display: block;width:500px;'></tbody>\
						</table>").appendTo(me.field_area);
				me.render_child(field, i)

		})

		$("<button class='btn btn-small btn-primary' style='margin-bottom:2%; margin-left:30%'><i class='icon-save'></i> Save </button>")
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
			if(key == 'Measurement Item')
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
			$("<td>").html('<input type="Textbox" class="text_box">').appendTo(row);
			$("<td>").html(dic['abbreviation']).appendTo(row);
			$("<td>").appendTo(row);
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
		
		frappe.call({
			method:"mreq.mreq.page.sales_dashboard.sales_dashboard.update_wo",
			args:{'wo_details': me.wo_details, 'style_details':me.style_details, 'fields':me.field_list, 'woname': me.woname},
			callback: function(r){
				// new frappe.SalesInvoce(me.wrapper)
			}
		})
	}
})


