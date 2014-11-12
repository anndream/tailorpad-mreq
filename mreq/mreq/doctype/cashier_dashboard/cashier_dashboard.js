// cur_frm.cscript.sales_invoice_no = function(doc, cdt, cdn){
// 	var d = locals[cdt][cdn]
// 	get_server_fields('get_outstanding_details',d.sales_invoice_no,'', doc, cdt, cdn,1, function(){
// 		refresh_field('payment')
// 	})
// }

cur_frm.fields_dict.payment.grid.get_field('sales_invoice_no').get_query = function(doc, cdt, cdn){
	return {
		filters :{
			'docstatus' : 1
		}
	}
}

cur_frm.cscript.make_payment_inv = function(doc, cdt, cdn){
	get_server_fields('make_payment','','', doc, cdt, cdn, 1, function(){
		refresh_field('payment')
	})
}

cur_frm.cscript.make_payment = function(doc, cdt, cdn){
	get_server_fields('make_payment','','', doc, cdt, cdn, 1, function(){
		refresh_field('payment')
	})
}

cur_frm.cscript.refresh = function(doc, cdt, cdn){
	get_server_fields('show_pending_balance_invoices','','', doc, cdt, cdn, 1, function(r){
		refresh_field('payment')
	})
}

cur_frm.cscript.amount = function(doc, cdt, cdn){
	var d =locals[cdt][cdn]
	blc = doc.payment || [ ]
	for(i=0; i<blc.length; i++){
		if(parseInt(blc[i].idx) == parseInt(d.idx) && parseFloat(blc[i].amount) > parseFloat(blc[i].outstanding)){
			blc[i].balance_amount = parseFloat(blc[i].amount) - parseFloat(blc[i].outstanding)	
		}else{
			blc[i].balance_amount = 0.0
		}
	}
	get_server_fields('calculate_status',d.idx,'', doc, cdt, cdn, 1, function(r){
		refresh_field('payment')
	})
	refresh_field('payment')
}

cur_frm.cscript.select_all = function(doc, cdt, cdn){
	blc = doc.payment || [ ]
	for(i=0; i<blc.length; i++){
		blc[i].select = 1
	}
	refresh_field('payment')
}

cur_frm.cscript.apply_status = function(doc, cdt, cdn){
	blc = doc.payment || [ ]
	for(i=0; i<blc.length; i++){
		blc[i].status = doc.apply_status
	}
	refresh_field('payment')
}