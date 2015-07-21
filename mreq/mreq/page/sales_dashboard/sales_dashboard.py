# from frappe.utils import getdate, flt, cint, nowdate, cstr
# from tools.custom_data_methods import get_user_branch

# @frappe.whitelist()
# def get_customer_list(search_key=None):
# 	cond = ''
# 	if search_key:
# 		cond = "where name like '%%%s%%'"%search_key

# 	return frappe.db.sql("""select name from tabCustomer %s"""%cond, as_list=1)

# @frappe.whitelist()
# def get_si_list(search_key=None):
# 	cond = ''
# 	if search_key:
# 		cond = "where customer like '%%%s%%'"%search_key

# 	return frappe.db.sql("""select name from `tabSales Invoice` %s"""%cond, as_list=1)

# @frappe.whitelist()
# def get_images(name):
# 	return frappe.db.sql("""select file_name from `tabFile Data` 
# 			where attached_to_doctype = 'Customer' 
# 				and attached_to_name = '%s'"""%(name),as_list=1)

# @frappe.whitelist()
# def create_customer(cust_details):
# 	cust_details = eval(cust_details)
# 	cust = frappe.new_doc("Customer")
# 	cust.customer_name = cust_details.get('customer_name')
# 	cust.customer_type = cust_details.get('customer_type')
# 	cust.customer_group = cust_details.get('customer_group')
# 	cust.territory = cust_details.get('territory')
# 	cust.date_of_birth = cust_details.get('date_of_birth')

# 	cust.set('body_measurements', [])
# 	for measurement_details in cust_details.get('Full Body Measurement Details'):
# 		e = cust.append('body_measurements', {})
# 		e.parameter = measurement_details.get('parameter')
# 		e.value = measurement_details.get('value')

# 	cust.save()

# 	create_contact(cust.name, cust_details)

# 	create_addr(cust.name, cust_details)

# def create_contact(name, cust_details):
# 	contact = frappe.new_doc('Contact')
# 	contact.first_name = name
# 	contact.customer = name
# 	contact.designation = cust_details.get('designation')
# 	contact.email_id = cust_details.get('email_id')
# 	contact.phone = cust_details.get('phone')
# 	contact.mobile_no = cust_details.get('mobile_no')
# 	contact.save()

# def create_addr(name, cust_details):
# 	addr = frappe.new_doc('Address')
# 	addr.address_title = name
# 	addr.address_line1 = cust_details.get('address_line1')
# 	addr.address_line2 = cust_details.get('address_line2')
# 	addr.city = cust_details.get('city')
# 	addr.email_id = cust_details.get('email_id')
# 	addr.phone = cust_details.get('phone')
# 	addr.customer = name
# 	addr.save()


# @frappe.whitelist()
# def get_cust_details(customer):
# 	customer_info = {}
# 	customer_details = frappe.db.sql("""select c.customer_name, c.customer_type, c.territory, 
# 			c.date_of_birth 
# 		from tabCustomer c
# 			where c.name = '%s'"""%customer,as_dict=1)
# 	if customer_details:
# 		customer_info.update(customer_details[0])
# 	customer_contact_detail = frappe.db.sql("""select co.designation, co.email_id, co.phone, co.mobile_no
# 		from tabContact co
# 			where co.customer = '%s'"""%customer,as_dict=1)
# 	if customer_contact_detail:
# 		customer_info.update(customer_contact_detail[0])
# 	customer_address_detail = frappe.db.sql("""select addr.address_line1, addr.address_line2, addr.city 
# 		from tabAddress addr 
# 			where addr.customer = '%s'"""%customer,as_dict=1)
# 	if customer_address_detail:
# 		customer_info.update(customer_address_detail[0])
# 	if customer_info:
# 		return customer_info

# @frappe.whitelist()
# def get_fabric_width(fabric_code):
# 	return frappe.db.get_value('Item', fabric_code, 'fabric_width')

# @frappe.whitelist()
# def get_size_and_rate(price_list, item_code, fabric_code, size):
# 	item_price = frappe.db.sql("""select ifnull(rate, 0.0) from `tabCustomer Rate` cr join `tabItem Price` ip  on cr.parent = ip.name 
# 					where cr.branch = '%(branch)s' and cr.size = '%(size)s' 
# 						and ip.price_list = '%(price_list)s' 
# 						and ip.item_code = '%(item_code)s'
# 				"""%{'branch': get_user_branch(), 'size': size, 'price_list': price_list, 'item_code': item_code})

# 	item_price = ((len(item_price[0]) > 1) and item_price[0] or item_price[0][0]) if item_price else None

# 	fabric_price = frappe.db.sql("""select ifnull(rate, 0.0) from `tabCustomer Rate` cr join `tabItem Price` ip  on cr.parent = ip.name 
# 					where cr.branch = '%(branch)s' and cr.size = '%(size)s' 
# 						and ip.price_list = '%(price_list)s' 
# 						and ip.item_code = '%(item_code)s'
# 				"""%{'branch': get_user_branch(), 'size': size, 'price_list': price_list, 'item_code': fabric_code})

# 	fabric_price = ((len(fabric_price[0]) > 1) and fabric_price[0] or fabric_price[0][0]) if fabric_price else None

# 	return flt(item_price) + flt(fabric_price)

# @frappe.whitelist()
# def get_fabric_qty(item_code, width, size):
# 	width = frappe.db.sql("""select ifnull(fabric_qty, 1) from `tabSize Item` where parent = '%s' and width = '%s' and size='%s'"""%(item_code, width, size),as_list=1)
# 	return	((len(width[0]) > 1) and width[0] or width[0][0]) if width else 1

# @frappe.whitelist()
# def get_merchandise_item_price(price_list, item_code):
# 	if price_list and item_code:
# 		return frappe.db.get_value('Item Price', {'price_list': price_list, 'item_code': item_code}, 'price_list_rate')
# 	else:
# 		return ''

# @frappe.whitelist()
# def get_work_orders(si_num):
# 	return frappe.db.sql("""select a.name from
# 		(SELECT tailor_work_order FROM `tabWork Order Distribution` WHERE parent = '%s') as foo, `tabWork Order` a
# 		where a.name=foo.tailor_work_order  and a.docstatus = 0"""%si_num.split('\t')[0])

# @frappe.whitelist()
# def create_si(si_details, fields, reservation_details):
# 	from datetime import datetime
# 	si_details = eval(si_details)
# 	fields = eval(fields)
# 	accounting_details = get_accounting_details()

# 	si = frappe.new_doc("Sales Invoice")

# 	for cust in si_details.get('Basic Info'):
# 		si.customer = cust[0]
# 		si.currency = frappe.db.get_value('Global Details', None, 'default_currency')
# 		si.delivery_date = datetime.strptime(cust[1] , '%d-%m-%Y').strftime('%Y-%m-%d')
# 		si.posting_date = datetime.strptime(cust[2] , '%d-%m-%Y').strftime('%Y-%m-%d')
# 		si.branch = get_user_branch()
# 		si.release = 1 if cust[3] == 'Yes' else 0

# 	si.set('sales_invoice_items_one', [])
# 	for tailoring_item in si_details.get('Tailoring Item Details'):
# 		item_details = get_item_details(tailoring_item[1])
# 		e = si.append('sales_invoice_items_one', {})
# 		e.tailoring_price_list = tailoring_item[0]
# 		e.tailoring_item_code = tailoring_item[1]
# 		e.tailoring_item_name = item_details[0]
# 		e.tailoring_description = item_details[1]
# 		e.fabric_code = tailoring_item[2]
# 		e.tailoring_size = tailoring_item[3]
# 		e.width = tailoring_item[4]
# 		e.fabric_qty = flt(tailoring_item[6])
# 		e.tailoring_qty = cint(tailoring_item[5])
# 		e.tailoring_rate = tailoring_item[7]
# 		e.tailoring_amount = flt(tailoring_item[6]) * flt(tailoring_item[7])
# 		e.tailoring_income_account = accounting_details[0]
# 		e.tailoring_cost_center = accounting_details[1]
# 		e.tailoring_branch = tailoring_item[8]

# 	si.set('merchandise_item', [])
# 	for merchandise_item in si_details.get('Merchandise Item Details'):
# 		item_details = get_item_details(merchandise_item[1])

# 		e = si.append('merchandise_item', {})
# 		e.merchandise_price_list = merchandise_item[0]
# 		e.merchandise_item_code = merchandise_item[1]
# 		e.merchandise_item_name = item_details[0]
# 		e.merchandise_description = item_details[1]
# 		e.merchandise_qty = cint(merchandise_item[2])
# 		e.merchandise_rate = cint(merchandise_item[3])
# 		e.merchandise_amount = flt(merchandise_item[2]) * flt(merchandise_item[3])
# 		e.merchandise_income_account = accounting_details[0]
# 		e.merchandise_cost_center = accounting_details[1]
# 		e.merchandise_branch = merchandise_item[4]

# 	for tax in si_details.get('Taxes and Charges'):
# 		si.taxes_and_charges = tax[0]
	
# 	si.fabric_details = reservation_details

# 	si.save()
# 	# frappe.msgprint(si.name)

# 	# si = frappe.get_doc('Sales Invoice', si.name)
# 	# si.submit()

# 	return si.name

# def get_tax_details(si):
# 	tax_details = frappe.db.sql("""select description, tax_amount, item_wise_tax_detail 
# 			from `tabSales Taxes and Charges` 
# 			where parent = '%s'"""%si,as_list=1)
	
# 	tab = """<table class='table table-bordered'>"""
# 	for tax in tax_details:
# 		tab += """<tr><td>%s</td><td>%s</td></tr>"""%(tax[0], tax[1])
		

# 	return tab

# @frappe.whitelist()
# def get_si_details(name):
# 	si = frappe.db.sql("""select si.name,si.customer, si.currency, 
# 								si.delivery_date, si.posting_date, 
# 								si.branch, si.authenticated 
# 						from `tabSales Invoice` si 
# 						where si.name = '%s' """%(name),as_dict=1)

# 	tailoring_item = frappe.db.sql("""select tailoring_price_list, tailoring_item_code, 
# 											fabric_code, tailoring_size, 
# 											width, fabric_qty, tailoring_qty, 
# 											tailoring_rate, tailoring_branch 
# 									from `tabSales Invoice Items` 
# 									where parent = '%s' """%(name), as_list=1)

# 	merchandise_item = frappe.db.sql("""select merchandise_price_list, merchandise_item_code, 
# 											merchandise_qty, merchandise_rate, merchandise_branch 
# 										from `tabMerchandise Items` 
# 										where parent = '%s'"""%(name), as_list=1)

# 	return {
# 		'si': si,
# 		'tailoring_item': tailoring_item,
# 		'merchandise_item': merchandise_item,
# 		"tax_details" : get_tax_details(name),
# 		"tot":frappe.db.get_value('Sales Invoice', name, 'rounded_total_export')
# 	}

# def get_item_details(item):
# 	return frappe.db.sql("select item_name, description from tabItem where name = '%s'"%item, as_list=1)[0][0]

# def get_accounting_details():
# 	company =  frappe.db.get_value('Global Defaults', None, 'default_company') 

# 	acc_details = frappe.db.sql('select default_income_account, cost_center from tabCompany where name = "%s"'%company, as_list=1)

# 	return ((len(acc_details[0]) > 1) and acc_details[0] or acc_details[0][0]) if acc_details else None

# mapper ={
# 	'Style Transactions':['field_name', "'' as text", 'abbreviation', "'' as image", "'view' as button" ],
# 	'Measurement Item': ['parameter', 'abbreviation', 'value']
# }

# tab_mapper = {
# 	'Style Transactions': '`tabWO Style`',
# 	'Measurement Item': '`tabMeasurement Item`'
# }

# @frappe.whitelist()
# def get_wo_details(tab, woname):
	
# 	if tab in mapper:
# 		return frappe.db.sql("""select %s from %s where parent = '%s'"""%(','.join(mapper.get(tab)), tab_mapper.get(tab),
# 			 woname.split('\t')[-1].strip()), as_dict=1)

# 	else:
# 		return frappe.db.sql(""" select sales_invoice_no, item_code, customer, serial_no_data from `tabWork Order` 
# 					where name = '%s' """%(woname.split('\t')[-1].strip()), as_dict=1)

# @frappe.whitelist()
# def update_wo(wo_details, fields, woname, style_details, args=None, type_of_wo=None):
# 	from frappe.utils import cstr

# 	wo = frappe.get_doc('Work Order', woname)
# 	style_details =  eval(style_details)

# 	for d in wo.get('wo_style'):
# 		for style in style_details:
# 			if d.field_name == style:
# 				frappe.db.sql("""update `tabWO Style` 
# 									set image_viewer = '%s', default_value = '%s', 
# 										abbreviation = '%s'
# 									where parent = '%s' and  field_name = '%s'
# 							"""%( cstr(style_details[style].get('image')), cstr(style_details[style].get('value')),
# 									cstr(style_details[style].get('abbr')),
# 									woname, style
# 								))
# 				frappe.db.sql("commit")

# 	wo_details = eval(wo_details)
# 	for d in wo.get('measurement_item'):
# 		for style in wo_details['Measurement Item']:
# 			if d.parameter == style[0]:				
# 				frappe.db.sql("""update `tabMeasurement Item` 
# 									set value ='%s'
# 									where parent = '%s' and  name = '%s'
# 							"""%(style[2], woname, d.name))
# 				frappe.db.commit()

# 	wo.save(1)
# 	frappe.msgprint("Updated.....")

# @frappe.whitelist()
# def get_amended_name(work_order):
# 	if '-' in work_order:
# 		woname = cstr(work_order).split('-')
# 		amend_no = cint(woname[len(woname) - 1]) + 1
# 		return woname[0] +'-'+ cstr(amend_no)
# 	else:
# 		return work_order + '-1'

# @frappe.whitelist()
# def check_swatch_group(fabric_code):
# 	if frappe.db.get_value('Item', fabric_code, 'item_group') == 'Fabric Swatch Item':
# 		return 1
# 	return 0

# def create_swatch_item_po(doc, method):
# 	supp_dic = {}
# 	for item in doc.get('sales_invoice_items_one'):
# 		if check_swatch_group(item.fabric_code) == 1:
# 			get_supplier_weise_po_details(item, supp_dic)
# 	make_po(supp_dic)

# def get_supplier_weise_po_details(item, supp_dic):
# 	"""
# 		1. get supplier from item master
# 		2. add supplier to dict and push fabric code and qty
# 		3. if supplier exist push list 

# 	"""
# 	supplier = frappe.db.get_value('Item', item.fabric_code, 'supplier_code')
# 	supp_dic[supplier] = [] if not supp_dic.get(supplier) else supp_dic.get(supplier)
# 	supp_dic[supplier].append([item.fabric_code, item.fabric_qty, frappe.db.get_value('Item', item.fabric_code, 'supplier_item_code')])


# def make_po(supp_dic):
# 	for supplier in supp_dic:
# 		po = frappe.new_doc("Purchase Order")
# 		po.supplier = supplier

# 		po.set('po_details', [])
# 		for item in supp_dic[supplier]:
# 			e = po.append('po_details', {})
# 			e.item_code = item[0]
# 			e.qty = item[1]
# 			e.supplier_item_code = item[2]
# 			e.schedule_date = nowdate()
# 		po.save()


# @frappe.whitelist()
# def create_work_order(wo_details,style_details, fields, woname,  args=None, type_of_wo=None):
# 	if args:
# 		args = eval(args)
# 		if woname:
# 			wo_data = frappe.db.get_value('Work Order', woname, '*')
# 			wo = frappe.new_doc('Work Order')
# 			wo.item_code = wo_data.item_code
# 			wo.status = wo_data.status
# 			wo.work_order_no = get_amended_name(woname)
# 			wo.customer = wo_data.customer
# 			wo.sales_invoice_no = wo_data.sales_invoice_no
# 			wo.customer_name = wo_data.customer_name
# 			wo.item_qty = wo_data.item_qty
# 			wo.trial_no = cint(args.get('trial_no'))
# 			wo.fabric__code = get_fabric_code(wo_data, wo.trial_no)
# 			wo.serial_no_data = wo_data.serial_no_data
# 			wo.pdd = wo_data.pdd
# 			create_work_order_style(wo, style_details)
# 			create_work_order_measurement(wo, wo_details)
# 			create_work_order_process(wo, woname)
# 			wo.submit()
# 			update_WorkOrder_Trials(wo)
# 			return wo.name, wo.trial_no
 
# def create_work_order_style(obj, args):
# 	if args:
# 		args = eval(args)
# 		for s in args:
# 			ws = obj.append('wo_style', {})
# 			ws.field_name = args[s].get('field_name')
# 			ws.abbreviation  = args[s].get('abbreviation')
# 			ws.table_view = 'Right'
# 			ws.default_value = args[s].get('default_value')
# 			ws.image_viewer = args[s].get('image_viewer')
# 	return True

# def create_work_order_measurement(obj, args):
# 	if args:
# 		args = eval(args)
# 		for s in args:
# 			mi = obj.append('measurement_item', {})
# 			mi.parameter = args[s].get('parameter')
# 			mi.abbreviation = args[s].get('abbreviation')
# 			mi.value = args[s].get('value')
# 	return True

# def create_work_order_process(obj, woname):
# 	wo_process = frappe.db.sql("""select * from `tabProcess Wise Warehouse Detail`
# 		where parent = '%s'"""%(woname), as_dict=1)
# 	if wo_process:
# 		for r in wo_process:
# 			pr = obj.append('process_wise_warehouse_detail', {})
# 			pr.process = r.process
# 			pr.actual_fabric = r.actual_fabric
# 			pr.warehouse = r.warehouse
# 	return True

# def get_fabric_code(args, trial_no):
# 	if trial_no:
# 		data = frappe.db.sql("""select a.actual_fabric from `tabTrial Dates` a, `tabTrials` b 
# 			where a.parent = b.name and b.work_order = '%s' and a.trial_no='%s'"""%(args.name, trial_no), as_list=1)
# 		if data:
# 			return frappe.db.get_value('Production Dashboard Details', args.pdd, 'fabric_code') if cint(data[0][0]) == 1 else args.fabric__code
# 		return args.fabric__code

# def update_WorkOrder_Trials(args):
# 	if args.name:
# 		frappe.db.sql(""" update `tabTrial Dates` a, `tabTrials` b set a.work_order = '%s' 
# 			where a.parent = b.name and a.trial_no='%s' and b.pdd = '%s'"""%(args.name, args.trial_no, args.pdd))
# 		return "Done"

import frappe
from frappe.utils import getdate, flt, cint, nowdate, cstr
from tools.custom_data_methods import get_user_branch, get_branch_warehouse
from erpnext.accounts.doctype.pricing_rule.pricing_rule import get_pricing_rule_for_item
from frappe.model.naming import make_autoname
import string
import random
import pdb
import json

@frappe.whitelist()
def get_customer_list(search_key=None):
	cond = ''
	if search_key:
		cond = "where c.name like '%%%s%%' or c.customer_name like '%%%s%%'"%(search_key, search_key)

	cust_list = frappe.db.sql("""select c.name as name, c.customer_name as customer_name, ifnull(co.email_id,'') as email, ifnull(co.mobile_no,'') as mobile_no 
				from tabCustomer c left join tabContact co 
				on c.name = co.customer
				%s order by c.creation desc"""%cond, as_dict=1)

	
	for cust in cust_list:
		cust.update({'label': cust['customer_name'] + ' - '+ cust['email'] + ' - ' + cust['mobile_no']})
		cust.update({'value': cust['name']})


	return cust_list

@frappe.whitelist()
def get_autocomplete_list():
	return get_customer_list()




	
@frappe.whitelist()
def get_si_list(search_key=None):
	cond = ''
	user_branch = frappe.db.get_value('User',frappe.session.user,'branch')
	if user_branch:
		cond = "branch = '%s' and"%user_branch
	if 	search_key:
		cond = ' customer like "%%%s%%" or name like "%%%s%%" and'%(search_key,search_key)	
	if search_key and user_branch:
		cond = 'branch = "%s" and (customer like "%%%s%%" or name like "%%%s%%") and'%(user_branch,search_key,search_key)
			
	return frappe.db.sql("""select name from `tabSales Invoice`  where  %s  docstatus !=2  order by creation desc"""%(cond), as_list=1)

@frappe.whitelist()
def get_images(name):
	return frappe.db.sql("""select file_name from `tabFile Data` 
			where attached_to_doctype = 'Customer' 
				and attached_to_name = '%s'"""%(name),as_list=1)

@frappe.whitelist()
def create_customer(cust_details):
	cust_details = eval(cust_details)
	cust = frappe.new_doc("Customer")
	cust.customer_name = cust_details.get('customer_name')
	cust.customer_type = cust_details.get('customer_type')
	cust.customer_group = cust_details.get('customer_group')
	cust.territory = cust_details.get('territory')

	cust.set('body_measurements', [])
	for measurement_details in cust_details.get('Full Body Measurement Details'):
		e = cust.append('body_measurements', {})
		e.parameter = measurement_details.get('parameter')
		e.value = measurement_details.get('value')

	cust.save()

	create_contact(cust.name, cust_details)

def create_contact(name, cust_details):
	contact = frappe.new_doc('Contact')
	contact.first_name = name
	contact.customer = name
	contact.email_id = cust_details.get('email_id')
	contact.mobile_no = cust_details.get('mobile_no')
	contact.save()

def create_addr(name, cust_details):
	addr = frappe.new_doc('Address')
	addr.address_title = name
	addr.address_line1 = cust_details.get('address_line1')
	addr.address_line2 = cust_details.get('address_line2')
	addr.city = cust_details.get('city')
	addr.email_id = cust_details.get('email_id')
	if cust_details.get('phone')=='':
		addr.phone = cust_details.get('mobile_no')
	else:
		addr.phone = cust_details.get('phone')
	addr.customer = name
	addr.save()


@frappe.whitelist()
def get_cust_details(customer):
	customer_info = {}
	customer_details = frappe.db.sql('''select c.customer_name, c.customer_type, c.territory, 
			c.customer_group 
		from tabCustomer c
			where c.name = "%s"'''%customer,as_dict=1)
	if customer_details:
		customer_info.update(customer_details[0])
	customer_contact_detail = frappe.db.sql('''select co.designation, co.email_id, co.phone, co.mobile_no
		from tabContact co
			where co.customer = "%s"'''%customer,as_dict=1)
	if customer_contact_detail:
		customer_info.update(customer_contact_detail[0])
	if customer_info:
		return customer_info

@frappe.whitelist()
def get_fabric_rate_and_width(fabric_code, price_list):
	return {
		'fc' : get_fabric_cost(fabric_code, price_list),
		'fw' : get_fabric_width(fabric_code)
	}

def get_fabric_cost(fabric_code, price_list):
	fabric_cost = frappe.db.sql("""select ifnull(rate,0) from `tabFabric Costing` 
		where parent = '%s' and merchandise_price_list ='%s'"""%(fabric_code, price_list))
	
	return ((len(fabric_cost[0]) > 1) and fabric_cost[0] or fabric_cost[0][0]) if fabric_cost else 0	

@frappe.whitelist()
def get_fabric_width(fabric_code):
	return frappe.db.get_value('Item', fabric_code, 'fabric_width')

@frappe.whitelist()
def get_size_and_rate(price_list, item_code, fabric_code, size, width, fabric_qty, fabric_rate):
	item_price = frappe.db.sql("""select ifnull(rate, 0.0) from `tabCustomer Rate` cr join `tabItem Price` ip  on cr.parent = ip.name 
					where cr.branch = '%(branch)s' and cr.size = '%(size)s' 
						and ip.price_list = '%(price_list)s' 
						and ip.item_code = '%(item_code)s'
				"""%{'branch': get_user_branch(), 'size': size, 'price_list': price_list, 'item_code': item_code})

	item_price = ((len(item_price[0]) > 1) and item_price[0] or item_price[0][0]) if item_price else None
	fabric_qty = get_fabric_qty(item_code, width, size)
	item_price = flt(item_price) + flt(fabric_qty.get('fabric_qty')) * flt(fabric_rate)

	# fabric_price = frappe.db.sql("""select ifnull(rate, 0.0) from `tabCustomer Rate` cr join `tabItem Price` ip  on cr.parent = ip.name 
	# 				where cr.branch = '%(branch)s' and cr.size = '%(size)s' 
	# 					and ip.price_list = '%(price_list)s' 
	# 					and ip.item_code = '%(item_code)s'
	# 			"""%{'branch': get_user_branch(), 'size': size, 'price_list': price_list, 'item_code': fabric_code})

	# fabric_price = ((len(fabric_price[0]) > 1) and fabric_price[0] or fabric_price[0][0]) if fabric_price else None

	return flt(item_price) 

@frappe.whitelist()
def get_fabric_qty(item_code, width, size):
	my_dict = {}
	fab_qty = 0.0
	if item_code:
		if frappe.db.get_value('Sales BOM', item_code, 'name'):
			name = frappe.db.sql(""" Select * from `tabSales BOM Item` where parent ='%s'
				and parenttype = 'Sales BOM' """%(item_code), as_dict=1)
			if name:
				for data in name:
					fab_qty += cint(frappe.db.get_value('Size Item', {'size': size, 'width': width, 'parent': data.item_code}, 'fabric_qty')) * cint(data.qty)
		else:
			fab_qty = frappe.db.get_value('Size Item', {'size': size, 'width': width, 'parent': item_code}, 'fabric_qty')
	my_dict['fabric_qty'] = fab_qty
	my_dict['total_expense'] = get_expenses(item_code)
	return my_dict

@frappe.whitelist()
def get_expenses(item_code):
	total_expense = 0
	raw_item_list = frappe.db.sql(""" select raw_item_code,qty from `tabRaw Material Item` where parent='{0}' """.format(item_code),as_list=1)
	for item in raw_item_list:
		item_rate = frappe.db.get_value("Item Price", {"price_list": 'Standard Buying',
					"item_code": item[0]}, "price_list_rate")
		if not item_rate:
			item_rate = cint(frappe.db.get_value('Item',item[0],'last_purchase_rate')) * item[1] if item[1] else 1	
		if item_rate:
			item_rate = item_rate * item[1] if item[1] else 1
			total_expense = cint(total_expense) + item_rate if  item_rate else 0
	return total_expense	

@frappe.whitelist()
def get_default_values():
	default_values=frappe.db.sql(""" select value from `tabSingles` where doctype='Selling Settings' and field in ('customer_group','territory') """,as_list=1)
	if default_values:
		return default_values	

@frappe.whitelist()
def get_merchandise_item_price(price_list, item_code):
	result_list = []
	if price_list and item_code:
		price = frappe.db.get_value('Item Price', {'price_list': price_list, 'item_code': item_code}, 'price_list_rate')
		result_list.append(price)
		group = frappe.db.get_value('Item', {'item_code': item_code},'item_group')
		result_list.append(group)
		return result_list

@frappe.whitelist()
def get_work_orders(si_num):
	return frappe.db.sql("""select name from `tabWork Order` where sales_invoice_no = '%s' and docstatus=0"""%si_num.split('\t')[0])

@frappe.whitelist()
def create_si(si_details, fields, reservation_details):
	from datetime import datetime
	si_details = eval(si_details)
	fields = eval(fields)
	accounting_details = get_accounting_details()
	# customer_name = ''

	si = frappe.new_doc("Sales Invoice")
	for cust in si_details.get('Basic Info'):
		si.customer = cust[0]
		# customer_name = cust[0]
		# if cust[3] and si_details.get('Tailoring Item Details'):
		# 	si.trial_date = datetime.strptime(cust[3], '%d-%m-%Y %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')
		si.currency = frappe.db.get_value('Global Details', None, 'default_currency')
		# si.delivery_date = datetime.strptime(cust[1] , '%d-%m-%Y').strftime('%Y-%m-%d')
		si.posting_date = datetime.strptime(cust[1], '%d-%m-%Y').strftime('%Y-%m-%d')
		si.branch = get_user_branch()
		si.release = 1 if cust[2] == 'Yes' else 0
	si.set('sales_invoice_items_one', [])
	for tailoring_item in si_details.get('Tailoring Item Details'):
		item_details = get_item_details(tailoring_item[1])
		# args = get_args_list(tailoring_item, item_details, si)
		# data = get_pricing_rule_for_item(args)
		e = si.append('sales_invoice_items_one', {})
		e.tailoring_price_list = tailoring_item[0]
		e.tailoring_item_code = tailoring_item[1]
		e.tailoring_item_name = item_details[0]
		e.tailoring_description = item_details[1]
		e.tailoring_stock_uom = frappe.db.get_value('Item', e.tailoring_item_code, 'stock_uom')
		e.fabric_code = tailoring_item[2]
		e.tailoring_size = tailoring_item[3]
		e.width = tailoring_item[5]
		e.fabric_qty = flt(tailoring_item[6])
		e.tailoring_qty = cint(tailoring_item[4])
		e.previous_quantity = cint(tailoring_item[4])
		e.tailoring_rate = tailoring_item[7]
		e.tailoring_amount = ( flt(tailoring_item[8]) - (  flt(tailoring_item[8]) * flt(tailoring_item[9])/100) )
		e.tailoring_discount_percentage =  flt(tailoring_item[9])
		e.tailoring_income_account = accounting_details[0]
		e.tailoring_cost_center = accounting_details[1]
		e.total_expenses = tailoring_item[12]
		e.tailoring_delivery_date = datetime.strptime(tailoring_item[10], '%d-%m-%Y').strftime('%Y-%m-%d')
		e.tailoring_branch = tailoring_item[11]
		e.split_qty_dict = tailoring_item[13]
		e.reserve_fabric_qty = tailoring_item[14]
		obj = frappe.get_doc('Item', e.tailoring_item_code)
		e.tailoring_item_tax_rate = json.dumps(dict(([d.tax_type, d.tax_rate] for d in obj.get("item_tax"))))
		if tailoring_item[13]:
			e.check_split_qty = 1

	si.set('merchandise_item', [])
	
	for merchandise_item in si_details.get('Merchandise Item Details'):
		item_details = get_item_details(merchandise_item[1])

		e = si.append('merchandise_item', {})
		e.merchandise_price_list = merchandise_item[0]
		e.merchandise_item_code = merchandise_item[1]
		e.merchandise_item_name = item_details[0]
		e.stock_uom = frappe.db.get_value('Item', e.merchandise_item_code, 'stock_uom')
		e.merchandise_description = item_details[1]
		e.merchandise_qty = cint(merchandise_item[2])
		e.merchandise_rate = cint(merchandise_item[4])
		total_amount =  flt(merchandise_item[2]) * flt(merchandise_item[4]) 
		e.merchandise_amount = ( total_amount - ( total_amount * flt( merchandise_item[5])/100 ) )
		e.merchandise_income_account = accounting_details[0]
		e.merchandise_cost_center = accounting_details[1]
		e.free = merchandise_item[3]
		e.merchandise_discount_percentage = flt( merchandise_item[5])
		e.merchandise_delivery_date = datetime.strptime(merchandise_item[7], '%d-%m-%Y').strftime('%Y-%m-%d')
		e.merchandise_branch = merchandise_item[6]
		obj = frappe.get_doc('Item', e.merchandise_item_code)
		e.merchandise_item_tax_rate = json.dumps(dict(([d.tax_type, d.tax_rate] for d in obj.get("item_tax"))))

	for tax in si_details.get('Taxes and Charges'):
		si.taxes_and_charges = tax[0]
	
	# si.fabric_details = reservation_details
	branch  = get_user_branch()
	if branch:
		abbr = frappe.db.get_value('Branch',branch,'branch_abbreviation')
		if abbr:
			si.name = make_autoname(abbr)
	si.save()

	# si = frappe.get_doc('Sales Invoice', si.name)
	# si.submit()
	frappe.msgprint("Sales Invoice %s, created successfully"%si.name)
	return si.name




def get_args_list(tailoring_item, args, si_details):
	return frappe._dict({
			"item_code": tailoring_item[1],
			"warehouse": get_branch_warehouse(tailoring_item[10]),
			"parenttype": "Sales Invoice",
			"parent":"New Sales Invoice",
			"customer" : si_details.customer,
			"currency" : frappe.db.get_value('Global Defaults', None, 'default_currency'),
			"conversion_rate" : 1,
			"price_list" : tailoring_item[0],
			"plc_conversion_rate" : 1,
			"company" : frappe.db.get_value('Global Defaults', None, 'default_company'),
			"is_pos" : 0,
			"is_subcontracted":0,
			"transaction_date" : nowdate(),
			"ignore_pricing_rule": 0,
			"doctype":"Sales Invoice Item",
			"name":"New Sales Invoice Item",
			"transaction_type":"selling"
		})

def get_args_list_for_PricingRule(args):
	return frappe._dict({
			"item_code": args.item_code,
			"warehouse": args.warehouse,
			"parenttype": args.parenttype,
			"parent": args.parent,
			"customer" : args.customer,
			"currency" : args.currency,
			"conversion_rate" : args.conversion_rate,
			"price_list" : args.price_list,
			"plc_conversion_rate" : args.plc_conversion_rate,
			"company" : args.company,
			"is_pos" : args.is_pos,
			"is_subcontracted": args.is_subcontracted,
			"transaction_date" : args.transaction_date,
			"ignore_pricing_rule": args.ignore_pricing_rule,
			"doctype": args.doctype,
			"name": args.name,
			"transaction_type": args.transaction_type
		})

def get_tax_details(si):
	tax_details = frappe.db.sql("""select description, tax_amount, item_wise_tax_detail 
			from `tabSales Taxes and Charges` 
			where parent = '%s'"""%si,as_list=1)
	
	tab = """<table class='table table-bordered'>"""
	for tax in tax_details:
		tab += """<tr><td>%s</td><td>%s</td></tr>"""%(tax[0], tax[1])
		

	return tab

@frappe.whitelist()
def get_si_details(name):
	si = frappe.db.sql("""select si.name,si.customer, si.currency, si.trial_date,
								si.delivery_date, si.posting_date, 
								si.branch, si.authenticated ,si.release
						from `tabSales Invoice` si 
						where si.name = '%s' """%(name),as_dict=1)

	tailoring_item = frappe.db.sql("""select  tailoring_price_list,
										tailoring_item_code, fabric_code, tailoring_size, 
											tailoring_qty, width, fabric_qty,  
											tailoring_rate, tailoring_amount,tailoring_discount_percentage,tailoring_delivery_date, tailoring_branch,total_expenses 
									from `tabSales Invoice Items` 
									where parent = '%s' """%(name), as_list=1)

	merchandise_item = frappe.db.sql("""select merchandise_price_list, merchandise_item_code, 
											merchandise_qty,free, merchandise_rate,merchandise_discount_percentage ,merchandise_delivery_date,merchandise_branch 
										from `tabMerchandise Items` 
										where parent = '%s'"""%(name), as_list=1)

	return {
		'si': si,
		'tailoring_item': tailoring_item,
		'merchandise_item': merchandise_item,
		"tax_details" : get_tax_details(name),
		"tot":frappe.db.get_value('Sales Invoice', name, 'rounded_total_export')
	}

def get_item_details(item):
	return frappe.db.sql("select item_name, description,item_group from tabItem where name = '%s'"%item, as_list=1)[0]

def get_accounting_details():
	company =  frappe.db.get_value('Global Defaults', None, 'default_company') 

	acc_details = frappe.db.sql('select default_income_account, cost_center from tabCompany where name = "%s"'%company, as_list=1)

	return ((len(acc_details[0]) > 1) and acc_details[0] or acc_details[0][0]) if acc_details else None

mapper ={
	'Style Transactions':["field_name", "default_value as text", "abbreviation", "image_viewer image", "'view' as button","cost_to_customer" ],
	'Measurement Item': ['parameter', 'abbreviation', 'value']
}

tab_mapper = {
	'Style Transactions': '`tabWO Style`',
	'Measurement Item': '`tabMeasurement Item`'
}

@frappe.whitelist()
def get_wo_details(tab, woname):
	
	if tab in mapper:
		return frappe.db.sql("""select 	%s from %s where parent = '%s' order by idx"""%(','.join(mapper.get(tab)), tab_mapper.get(tab),
			 woname.split('\t')[-1].strip()),  as_dict=1)

	else:
		return frappe.db.sql(""" select sales_invoice_no, item_code, customer, serial_no_data, note as note from `tabWork Order` 
					where name = '%s' """%(woname.split('\t')[-1].strip()), as_dict=1)

@frappe.whitelist()
def update_wo(wo_details, fields, woname, style_details,note,measured_by ,args=None, type_of_wo=None):
	from frappe.utils import cstr
	wo = frappe.get_doc('Work Order', woname)
	style_details =  eval(style_details)
	if note or measured_by:
		frappe.db.sql(""" update `tabWork Order` set note = '%s', measured_by = '%s' where name = '%s'"""%(note, measured_by,woname))

	for d in wo.get('wo_style'):
		for style in style_details:
			if d.field_name == style:
				frappe.db.sql("""update `tabWO Style` 
									set image_viewer ='%s', default_value = '%s', 
										abbreviation = '%s' ,cost_to_customer = '%s'
									where parent = '%s' and  field_name = '%s'
							"""%( cstr(style_details[style].get('image')), cstr(style_details[style].get('value')),
									cstr(style_details[style].get('abbr')), flt(style_details[style].get('customer_cost')),
									woname, style
								))
				frappe.db.sql("commit")

	wo_details = eval(wo_details)
	for d in wo.get('measurement_item'):
		for style in wo_details['Measurement Item']:
			if d.parameter == style[0]:				
				frappe.db.sql("""update `tabMeasurement Item` 
									set value ='%s'
									where parent = '%s' and  name = '%s'
							"""%(style[2], woname, d.name))
				frappe.db.commit()

	# wo.save(1)

	frappe.msgprint("Updated.....")




@frappe.whitelist()
def copy_work_order_details(wo_details, fields, woname, style_details,note,measured_by ,sales_invoice,item_code,args=None, type_of_wo=None):
	from frappe.utils import cstr
	if woname and sales_invoice and item_code:
		work_orders = frappe.db.sql(""" SELECT
												    wo.name
												FROM
												    `tabWork Order` wo
												WHERE
												    wo.sales_invoice_no ='%s'
												AND wo.item_code = '%s'
												AND wo.docstatus = 0  """%(sales_invoice,item_code),as_dict=1)
		wo_details = eval(wo_details)
		for wo_name in work_orders:
			wo = frappe.get_doc('Work Order', wo_name.get('name'))
			for d in wo.get('measurement_item'):
				for style in wo_details['Measurement Item']:
					if d.parameter == style[0]:				
						frappe.db.sql("""update `tabMeasurement Item` 
											set value ='%s'
											where parent = '%s' and  name = '%s'
									"""%(style[2],wo_name.get('name'), d.name))
						frappe.db.commit()				
	# wo.save(1)
		frappe.msgprint("Updated.....")




@frappe.whitelist()
def get_amended_name(work_order, old_work_order):
	from frappe.utils import cstr, cint
	if '-' in work_order:
		woname = cstr(work_order).split('-')
		amend_no = cint(woname[len(woname) - 1]) + 1
		return old_work_order +'-'+ cstr(amend_no)
	else:
		return old_work_order + '-1'

@frappe.whitelist()
def check_swatch_group(fabric_code):
	if frappe.db.get_value('Item', fabric_code, 'item_group') == 'Fabric Swatch Item':
		return 1
	return 0

def create_swatch_item_po(doc, method):
	supp_dic = {}
	for item in doc.get('sales_invoice_items_one'):
		if check_swatch_group(item.fabric_code) == 1:
			get_supplier_weise_po_details(item, supp_dic)
	make_po(supp_dic)

def get_supplier_weise_po_details(item, supp_dic):
	"""
		1. get supplier from item master
		2. add supplier to dict and push fabric code and qty
		3. if supplier exist push list 

	"""
	supplier = frappe.db.get_value('Item', item.fabric_code, 'supplier_code')
	supp_dic[supplier] = [] if not supp_dic.get(supplier) else supp_dic.get(supplier)
	supp_dic[supplier].append([item.fabric_code, item.fabric_qty, frappe.db.get_value('Item', item.fabric_code, 'supplier_item_code')])


def make_po(supp_dic):
	for supplier in supp_dic:
		name = frappe.db.get_value('Purchase Order',{'supplier':supplier, 'docstatus':0},'name')
		if name:
			po = frappe.get_doc('Purchase Order', name)
		else:
			po = frappe.new_doc("Purchase Order")
			po.supplier = supplier

		# po.set('po_details', [])
		for item in supp_dic[supplier]:
			e = po.append('po_details', {})
			e.item_code = item[0]
			e.qty = item[1]
			e.supplier_item_code = item[2]
			e.schedule_date = nowdate()
			e.warehouse = get_branch_warehouse(get_user_branch())
		po.save()


@frappe.whitelist()
def create_work_order(wo_details,style_details, fields, woname, note,  args=None, type_of_wo=None):
	if args:
		args = eval(args)
		if woname:
			wo_data = frappe.db.get_value('Work Order', woname, '*')
			wo = frappe.new_doc('Work Order')
			wo.item_code = wo_data.item_code
			wo.status = wo_data.status
			wo.delivery_date = wo_data.delivery_date
			wo.note = note
			wo.work_order_no = get_amended_name(woname, wo_data.work_order_name)
			wo.customer = wo_data.customer
			wo.sales_invoice_no = wo_data.sales_invoice_no
			wo.customer_name = wo_data.customer_name
			wo.work_order_name = wo_data.work_order_name
			wo.item_qty = wo_data.item_qty
			wo.trial_no = cint(args.get('trial_no'))
			wo.fabric__code = get_fabric_code(wo_data, wo.trial_no)
			wo.current_process = wo_data.current_process
			wo.total_process = wo_data.total_process 
			wo.serial_no_data = wo_data.serial_no_data
			wo.pdd = wo_data.pdd
			create_work_order_style(wo, style_details)
			create_work_order_measurement(wo, wo_details)
			create_work_order_process(wo, woname)
			update_WorkOrder_Trials(wo.work_order_no, wo.trial_no, wo.pdd, wo)
			wo.submit()
			return wo.name, wo.trial_no
 
def create_work_order_style(obj, args):
	if args:
		args = eval(args)
		i = 0 
		for s in args:
			if args[s].get('default_value'):
				ws = obj.append('wo_style', {})
				ws.field_name = args[s].get('field_name')
				ws.abbreviation  = args[s].get('abbreviation')
				ws.table_view = 'Right' if i % 2 ==1 else 'Left'
				ws.default_value = args[s].get('default_value')
				ws.image_viewer = '<img src="%s" width="100px">'%(args[s].get('image_viewer'))
				i = i + 1
	return True

def create_work_order_measurement(obj, args):
	if args:
		args = eval(args)
		for s in args:
			mi = obj.append('measurement_item', {})
			mi.parameter = args[s].get('parameter')
			mi.abbreviation = args[s].get('abbreviation')
			mi.value = args[s].get('value')
	return True

def create_work_order_process(obj, woname):
	wo_process = frappe.db.sql("""select * from `tabProcess Wise Warehouse Detail`
		where parent = '%s'"""%(woname), as_dict=1)
	if wo_process:
		for r in wo_process:
			pr = obj.append('process_wise_warehouse_detail', {})
			pr.process = r.process
			pr.actual_fabric = r.actual_fabric
			pr.warehouse = r.warehouse
	return True

def get_fabric_code(args, trial_no):
	if trial_no:
		data = frappe.db.sql("""select a.actual_fabric from `tabTrial Dates` a, `tabTrials` b 
			where a.parent = b.name and b.work_order = '%s' and a.trial_no='%s'"""%(args.name, trial_no), as_list=1)
		if data:
			return frappe.db.get_value('Production Dashboard Details', args.pdd, 'fabric_code') if cint(data[0][0]) == 1 else args.fabric__code
		return args.fabric__code

def update_WorkOrder_Trials(name, trial_no, pdd, args):
	if name:
		frappe.db.sql(""" update `tabTrial Dates` a, `tabTrials` b set a.work_order = '%s' 
			where a.parent = b.name and a.trial_no>='%s' and b.pdd = '%s'"""%(name, trial_no, pdd))
		process_name = frappe.db.get_value('Process Log',{'trials':trial_no, 'parent': pdd}, 'process_data')
		if process_name:
			frappe.db.sql(""" update `tabProcess Allotment` set work_order = '%s' where
				name = '%s'	"""%(name, process_name))

		frappe.db.sql(''' update `tabProcess Allotment` set work_order = "%s" where item = "%s"
			and sales_invoice_no = "%s" and ifnull(process_status, "Open") <> "Closed"'''%(name, args.item_code, args.sales_invoice_no))

		return "Done"


@frappe.whitelist()
def get_release_status():
	value = frappe.db.sql("select value from `tabSingles` where doctype='Selling Settings' and field='show_sales_invoice_release_option' ")
	#role_list = frappe.db.get_value()
	return value


@frappe.whitelist()
def get_expenses_status():
	value = frappe.db.sql("select value from `tabSingles` where doctype='Selling Settings' and field='allow_user_to_calculate_expenses_' ")
	return value	

@frappe.whitelist()
def get_branch():
	return get_user_branch()				

@frappe.whitelist()
def get_product_rate(item_code, service, size, width):
	if frappe.db.get_value('Item', item_code, 'service') == service:
		product_rate = frappe.db.get_value('Costing Item', {'parent': item_code, 'branch': get_user_branch(), 'size': size}, 'service_rate') or 0.0
		qty = frappe.db.get_value('Size Item', {'parent': item_code, 'size': size, 'width': width}, 'fabric_qty') or 0.0
		return product_rate, qty
	return 0.0, 0.0
