import frappe

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