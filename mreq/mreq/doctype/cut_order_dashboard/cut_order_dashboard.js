cur_frm.cscript.onload = function(doc, cdt, cdn){
	return get_server_fields('get_invoice_details', '', '', doc, cdt, cdn, 1, function(){
		refresh_field('cut_order_item')
	});
}

