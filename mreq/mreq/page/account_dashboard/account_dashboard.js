frappe.pages['account-dashboard'].onload = function(wrapper) {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Account Dashboard',
		single_column: true
	});
	$('<div class="auto_overflow" style="width:100%; float:left"><h4>Branch Wise Details</h4><table id="account_dashboard" class="table table-bordered" style="width:100%;min-height:100px;"><tr><td id="column_chart">\
		</td></tr></table></div><div class="auto_overflow" style="width:100%; float:left"><h4 class="tailoring_class">Tailoring Details</h4><table class="table table-bordered"><tr><td class="tailoring_class" id="pie_chart_tailoring"></td></tr></table></div>\
		<div class="auto_overflow" style="width:100%; float:left"><h4 class="merchandise_class">Merchandise Details</h4>\
		<table class="table table-bordered"><tr><td class="merchandise_class" id="pie_chart_merchandise"></td></tr></table></div>\
		<div class="auto_overflow" style="width:100%; float:left"><h4 class="supplier_class">Supplier Details</h4>\
		<table class="table table-bordered"><tr><td class="supplier_class" id="supplier_details"></td></tr></table></div>\
		<div class="auto_overflow" style="width:100%; float:left"><h4 >Attendance Details</h4>\
		<table id="attendance_table" class="table table-bordered"><tr><td  id="attendance_filtter"></td></tr><tr><td class="attendance_class" id="attendance_data"></td></tr></table></div>').appendTo($(wrapper).find('.layout-main'))
	new frappe.AccountDashboard(wrapper)
}

frappe.AccountDashboard = Class.extend({
	init: function(wrapper){
		this.wrapper = wrapper
		this.make_controller()
		this.render_data()
		this.supplier_details()
		this.attendance()
		this.auto_overflow()
	},

	make_controller: function(){
		var me = this;
		
		this.from_date = this.wrapper.appframe.add_date("From Date").change(function(){me.render_data()});
		this.to_date = this.wrapper.appframe.add_date("To Date").change(function(){me.render_data()});
		this.branch = this.wrapper.appframe.add_field({fieldtype:"Link", label:"Branch",
			fieldname:"branch", options:'Branch', input_css: {"z-index": 3}});
		this.fiscal_year = this.wrapper.appframe.add_field({fieldtype:"Link", label:"Fiscal Year",
			fieldname:"fiscal_year", options:'Fiscal Year', default:sys_defaults.fiscal_year, input_css: {"z-index": 3}});
		this.type_of_group = this.wrapper.appframe.add_field({fieldtype:"Select", label:"Type",
			fieldname:"type_of_group",options:"All\nTailoring\nMerchandise", input_css: {"z-index": 3}});
		this.type_of_group.$input.on("change", function() {me.render_data();})
		this.branch.$input.on("change", function() {me.render_data();})
		this.fiscal_year.$input.on("change", function() {me.render_data();})
		this.attendance_from_date=frappe.ui.form.make_control({
		df: {
		    "fieldtype": "Date",
			"label": "Date",
			"fieldname": "attendance_from_date",
			"placeholder": "Date",
			"default":"Today"
			},
		parent:$(me.wrapper).find("#attendance_filtter"),
		});
		$(this.wrapper).find("#attendance_filtter").css("width","200px");
		this.attendance_from_date.make_input();
		this.attendance_from_date.$input.on('change', function(){
			me.attendance()
		})
	},

	render_data : function(){
		var me = this
		args = {'type_of_group':this.type_of_group.$input.val(), 'from_date':this.from_date.val(), 'to_date':this.to_date.val(), 'branch':this.branch.$input.val(), 'fiscal_year':this.fiscal_year.$input.val()}
		var	me = this;
		frappe.call({
			method:'mreq.mreq.page.account_dashboard.account_dashboard.get_data_for_account_dashboard',
			args: {
				'args': args
			},
			callback : function(r){
				if(r.message)
					if (me.type_of_group.$input.val() == 'All'){
						me.make_design_for_all(r.message)
					}
					else if(me.type_of_group.$input.val() == 'Tailoring'){
						me.column_chart_method(r.message)
						me.pie_chart_tailoring(r.message)
					}
					else{
						me.column_chart_method(r.message)
						me.pie_chart_merchandise(r.message)
					}
			}
		})
	},

	make_design_for_all : function(obj){
		var me = this;
		this.column_chart_method(obj[0])
		this.pie_chart_tailoring(obj[1])
		this.pie_chart_merchandise(obj[2])
	},

	column_chart_method : function(args){
		var me = this;
		var options = {packages: ['corechart'], callback : drawChart};
		google.load('visualization', '1', options);
	    function drawChart()
	    {
	    	var data = google.visualization.arrayToDataTable(args);
	    	var options = {
	      					title: 'Branch Wise Combined Sales Details',
	      					width: 800,
	        				height: 250,
	        				legend: { position: 'top', maxLines: 3 },
	       					bar: { groupWidth: '75%' },
	       					isStacked: true,
	    	};
	    	
	    	var chart = new google.visualization.ColumnChart(document.getElementById('column_chart'));
	    	chart.draw(data, options);
        }
	},

	pie_chart_tailoring : function(args){
		var me = this;
		$(this.wrapper).find('.tailoring_class').css('display','block');
		if (args.length > 1) {

			if (me.type_of_group.$input.val() == 'Tailoring'){
				$(this.wrapper).find('.merchandise_class').css('display','none');
			}
			var options = {packages: ['corechart'], callback : drawChart};
			google.load('visualization', '1', options);
		    function drawChart()
		    {				 
		    	var data = google.visualization.arrayToDataTable(args);
		    	var options = {
		      				title: 'Branch Wise Tailoring Sales Details',
		      				width: 400,
	        				height: 200,
	        				legend: { position: 'top', maxLines: 3 },
	       					bar: { groupWidth: '25%' },
	       					isStacked: true,
		    	};
		    var chart = new google.visualization.PieChart(document.getElementById('pie_chart_tailoring'));
		    chart.draw(data, options);
	        }
    	}else{
    		$(this.wrapper).find('.merchandise_class').css('display','none');
    	}
	},

	pie_chart_merchandise : function(args){
		var me = this;
		$(this.wrapper).find('.merchandise_class').css('display','block');
		if (args.length > 1) {
			if (me.type_of_group.$input.val() == 'Merchandise'){
				$(this.wrapper).find('.tailoring_class').css('display','none');
			}
			var options = {packages: ['corechart'], callback : drawChart};
		    google.load('visualization', '1', options);
		    function drawChart()
		    {				 
		    	var data = google.visualization.arrayToDataTable(args);
		    	var options = {
		      				title: 'Branch Wise	Merchandise Sales Details',
		      				width: 400,
	        				height: 200,
	        				legend: { position: 'top', maxLines: 3 },
	       					bar: { groupWidth: '25%' },
	       					isStacked: true,
		    	};
		    var chart = new google.visualization.PieChart(document.getElementById('pie_chart_merchandise'));
		    chart.draw(data, options);
	        }
        }else{
        	$(me.wrapper).find('.merchandise_class').css('display','none');
        }
	},

	supplier_details : function(){
		var me = this;
		frappe.call({
			method:'mreq.mreq.page.account_dashboard.account_dashboard.get_supplier_details',
			callback : function(r){
				if(r.message.length > 1)
					{					
						$('.supplier_class').css('visibility','display')
						var options = {packages: ['corechart'], callback : drawChart};
					    google.load('visualization', '1', options);
					    function drawChart()
					    {				 
					    	var data = google.visualization.arrayToDataTable(r.message);
					    	var options = {
					      				title: 'Branch Wise	Merchandise Sales Details',
					      				width: 400,
				        				height: 200,				        	
				        				legend: { position: 'top', maxLines: 3 },
				       					bar: { groupWidth: '25%' },
				       					isStacked: true,
					    	};
						    var chart = new google.visualization.ColumnChart(document.getElementById('supplier_details'));
						    chart.draw(data, options);
						    google.visualization.events.addListener(chart, 'select', selectHandler);
			    			function selectHandler() {
								window.open('#query-report/Accounts Payable','_self')
							}
				        }
					}else{
							$('.supplier_class').css('visibility','hidden')
					}
			}
		})
	},

	attendance : function(){
		var me = this;
		frappe.call({
			method:'mreq.mreq.page.account_dashboard.account_dashboard.get_data_for_attendance',
			args: {
					'from_date' : this.attendance_from_date.$input.val()
			},
			callback : function(r){
				if(r.message)
					{					
						$('.attendance_class').css('visibility','display')
						var options = {packages: ['corechart'], callback : drawChart};
					    google.load('visualization', '1', options);
					    function drawChart() {
					    		var data = google.visualization.arrayToDataTable(r.message);
							    	var options = {
							      		title: 'Attendance Details',
				      					width: 600,
				        				height: 250,
				        				legend: { position: 'top', maxLines: 3 },
				       					bar: { groupWidth: '75%' },
				       					isStacked: true,
							    };							   
							    var chart = new google.visualization.ColumnChart(document.getElementById('attendance_data'));
				    			chart.draw(data, options);
				    			google.visualization.events.addListener(chart, 'select', selectHandler);
				    			function selectHandler() {
									window.open('#Report/Attendance','_self')
								}					 
					      }
					}else{
							$('.attendance_class').css('visibility','hidden')						
					}
			}
		})
	},
	auto_overflow : function(){
		
		$(this.wrapper).find(".auto_overflow").hover(function(){
                           $(this).css('overflow','auto')
                         }, function(){
                           $(this).css('overflow','hidden')
        })
	}
})