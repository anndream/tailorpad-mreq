cur_frm.cscript.create_material_receipt = function(doc, dt, dn) {
	var se = frappe.model.make_new_doc_and_get_name('Stock Entry');
	se = locals['Stock Entry'][se];
	se.purpose = 'Material Receipt'
	for (row in doc.raised_by){
		if(doc.raised_by[row].rs_checked == 1){
			var d1 = frappe.model.add_child(se, 'Stock Entry Detail', 'mtn_details');
			d1.item_code = doc.raised_by[row].item
			d1.item_name = doc.raised_by[row].item_name
			d1.description = doc.raised_by[row].description
			d1.stock_uom = doc.raised_by[row].uom
			d1.t_warehouse = doc.raised_by[row].for_warehouse
			d1.material_request = doc.raised_by[row].material_request
			d1.material_request_item = doc.raised_by[row].mri_name
			d1.qty = doc.raised_by[row].qty
		}
	}
	loaddoc('Stock Entry', se.name);
}

cur_frm.cscript.material_issue = function(doc, dt, dn) {
	var se = frappe.model.make_new_doc_and_get_name('Stock Entry');
	se = locals['Stock Entry'][se];
	se.purpose = 'Material Issue'

	for (row in doc.request_for){
		if(doc.request_for[row].rf_check == 1){
			var d1 = frappe.model.add_child(se, 'Stock Entry Detail', 'mtn_details');
			d1.item_code = doc.request_for[row].item
			d1.item_name = doc.request_for[row].item_name
			d1.description = doc.request_for[row].description
			d1.stock_uom = doc.request_for[row].uom
			d1.s_warehouse = doc.request_for[row].from_warehouse
			d1.qty = doc.request_for[row].qty
		}
	}
	loaddoc('Stock Entry', se.name);
}


cur_frm.cscript.material_request = function(doc, dt, dn) {
	var mr = frappe.model.make_new_doc_and_get_name('Material Request');
	mr = locals['Material Request'][mr];

	for (row in doc.request_for){
		if(doc.request_for[row].rf_check == 1){
			var d1 = frappe.model.add_child(mr, 'Material Request Item', 'indent_details');
			d1.item_code = doc.request_for[row].item
			d1.item_name = doc.request_for[row].item_name
			d1.description = doc.request_for[row].description
			d1.uom = doc.request_for[row].uom
			d1.warehouse = doc.request_for[row].from_warehouse
			d1.qty = doc.request_for[row].qty
		}
	}
	loaddoc('Material Request', mr.name);
}

cur_frm.cscript.cut_order = function(doc, cdt, cdn){
	return get_server_fields('create_co', '', '', doc, cdt, cdn, 1, function(){
		refresh_field('request_for')
	});
}