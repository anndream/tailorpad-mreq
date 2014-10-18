cur_frm.cscript.sales_invoice_no = function(doc, cdt, cdn){
	var d = locals[cdt][cdn]
	get_server_fields('get_outstanding_details',d.sales_invoice_no,'', doc, cdt, cdn,1, function(){
		refresh_field('payment')
	})
}

cur_frm.fields_dict.payment.grid.get_field('sales_invoice_no').get_query = function(doc, cdt, cdn){
	return {
		filters :{
			'docstatus' : 1
		}
	}
}

cur_frm.cscript.make_payment = function(doc, cdt, cdn){
	get_server_fields('make_payment','','', doc, cdt, cdn, 1, function(){
		refresh_field('payment')
	})
}