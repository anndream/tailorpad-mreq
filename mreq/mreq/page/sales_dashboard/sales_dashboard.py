import frappe
from frappe.utils import getdate, flt, cint

@frappe.whitelist()
def get_customer_list(search_key=None):
	cond = ''
	if search_key:
		cond = "where name like '%%%s%%'"%search_key

	return frappe.db.sql("""select name from tabCustomer %s"""%cond, as_list=1)

@frappe.whitelist()
def get_si_list(search_key=None):
	cond = ''
	if search_key:
		cond = "where customer like '%%%s%%'"%search_key

	return frappe.db.sql("""select name from `tabSales Invoice` %s"""%cond, as_list=1)

@frappe.whitelist()
def create_customer(cust_details):
	cust_details = eval(cust_details)
	cust = frappe.new_doc("Customer")
	cust.customer_name = cust_details.get('customer_name')
	cust.customer_type = cust_details.get('customer_type')
	cust.customer_group = cust_details.get('customer_group')
	cust.territory = cust_details.get('territory')
	cust.date_of_birth = cust_details.get('date_of_birth')
	cust.save()

	create_contact(cust.name, cust_details)

	create_addr(cust.name, cust_details)

def create_contact(name, cust_details):
	contact = frappe.new_doc('Contact')
	contact.first_name = name
	contact.customer = name
	contact.designation = cust_details.get('designation')
	contact.email_id = cust_details.get('email_id')
	contact.phone = cust_details.get('phone')
	contact.mobile_no = cust_details.get('mobile_no')
	contact.save()

def create_addr(name, cust_details):
	addr = frappe.new_doc('Address')
	addr.address_title = name
	addr.address_line1 = cust_details.get('address_line1')
	addr.address_line2 = cust_details.get('address_line2')
	addr.city = cust_details.get('city')
	addr.email_id = cust_details.get('email_id')
	addr.phone = cust_details.get('phone')
	addr.customer = name
	addr.save()


@frappe.whitelist()
def get_cust_details(customer):
	return frappe.db.sql("""select c.customer_name, c.customer_type, c.territory, 
			c.date_of_birth, co.designation, co.email_id, co.phone, 
			co.mobile_no, addr.address_line1, addr.address_line2, addr.city 
		from tabCustomer c, tabContact co, tabAddress addr 
			where c.name = co.customer 
				and c.name = addr.customer 
				and addr.is_primary_address 
				and co.is_primary_contact 
				and c.name = '%s'"""%customer,as_dict=1, debug=1)[0]


@frappe.whitelist()
def get_size_and_rate(price_list, item_code, fabric_code, branch, size):
	item_price = frappe.db.sql("""select rate from `tabCustomer Rate` cr join `tabItem Price` ip  on cr.parent = ip.name 
					where cr.branch = '%(branch)s' and cr.size = '%(size)s' 
						and ip.price_list = '%(price_list)s' 
						and ip.item_code = '%(item_code)s'
				"""%{'branch': branch, 'size': size, 'price_list': price_list, 'item_code': item_code})

	item_price = ((len(item_price[0]) > 1) and item_price[0] or item_price[0][0]) if item_price else None

	fabric_price = frappe.db.sql("""select rate from `tabCustomer Rate` cr join `tabItem Price` ip  on cr.parent = ip.name 
					where cr.branch = '%(branch)s' and cr.size = '%(size)s' 
						and ip.price_list = '%(price_list)s' 
						and ip.item_code = '%(item_code)s'
				"""%{'branch': branch, 'size': size, 'price_list': price_list, 'item_code': fabric_code})

	fabric_price = ((len(fabric_price[0]) > 1) and fabric_price[0] or fabric_price[0][0]) if fabric_price else None

	return flt(item_price) + flt(fabric_price)

@frappe.whitelist()
def get_work_orders(si_num):
	return frappe.db.sql("""select tailor_work_order from `tabWork Order Distribution` where parent = '%s'"""%si_num.split('\t')[0])

@frappe.whitelist()
def create_si(si_details, fields):
	from datetime import datetime

	si_details = eval(si_details)
	fields = eval(fields)
	accounting_details = get_accounting_details()

	si = frappe.new_doc("Sales Invoice")

	for cust in si_details.get('Basic Info'):
		si.customer = cust[0]
		si.currency = cust[1]
		si.delivery_date = datetime.strptime(cust[2] , '%d-%m-%Y').strftime('%Y-%m-%d')
		si.posting_date = datetime.strptime(cust[3] , '%d-%m-%Y').strftime('%Y-%m-%d')
		si.branch = cust[4]

	si.set('sales_invoice_items_one', [])
	for tailoring_item in si_details.get('Tailoring Item Details'):
		item_details = get_item_details(tailoring_item[1])

		e = si.append('sales_invoice_items_one', {})
		e.tailoring_price_list = tailoring_item[0]
		e.tailoring_item_code = tailoring_item[1]
		e.tailoring_item_name = item_details[0]
		e.tailoring_description = item_details[1]
		e.fabric_code = tailoring_item[2]
		e.tailoring_size = tailoring_item[3]
		e.width = tailoring_item[4]
		e.fabric_qty = cint(tailoring_item[5])
		e.tailoring_qty = cint(tailoring_item[6])
		e.tailoring_rate = tailoring_item[7]
		e.tailoring_amount = flt(tailoring_item[6]) * flt(tailoring_item[7])
		e.tailoring_income_account = accounting_details[0]
		e.tailoring_cost_center = accounting_details[1]

	si.set('merchandise_item', [])
	for merchandise_item in si_details.get('Merchandise Item Details'):
		item_details = get_item_details(merchandise_item[1])

		e = si.append('merchandise_item', {})
		e.merchandise_price_list = merchandise_item[0]
		e.merchandise_item_code = merchandise_item[1]
		e.merchandise_item_name = item_details[0]
		e.merchandise_description = item_details[1]
		e.merchandise_qty = cint(merchandise_item[2])
		e.merchandise_rate = cint(merchandise_item[3])
		e.merchandise_amount = flt(merchandise_item[2]) * flt(merchandise_item[3])
		e.merchandise_income_account = accounting_details[0]
		e.merchandise_cost_center = accounting_details[1]

	si.save()
	frappe.msgprint(si.name)

def get_item_details(item):
	return frappe.db.sql("select item_name, description from tabItem where name = '%s'"%item, as_list=1)[0][0]

def get_accounting_details():
	company =  frappe.db.get_value('Global Defaults', None, 'default_company') 

	acc_details = frappe.db.sql('select default_income_account, cost_center from tabCompany where name = "%s"'%company, as_list=1)

	return ((len(acc_details[0]) > 1) and acc_details[0] or acc_details[0][0]) if acc_details else None

mapper ={
	'Style Transactions':['field_name', 'abbreviation', "'' as image", "'view' as button" ]
}

@frappe.whitelist()
def get_wo_details(tab, woname):
	
	if tab in mapper:
		return frappe.db.sql("""select %s from `tabWO Style` where parent = '%s'"""%(','.join(mapper.get(tab)),
			 woname.split('\t')[-1].strip()), debug=1, as_dict=1)