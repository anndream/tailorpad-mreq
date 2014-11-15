from __future__ import unicode_literals
import frappe
from frappe import _
import frappe.defaults
import frappe.permissions
from frappe.core.doctype.user.user import get_system_users
from frappe.utils.csvutils import UnicodeWriter, read_csv_content_from_uploaded_file
from frappe.defaults import clear_default
import datetime
from frappe.utils import flt, cstr, nowdate, now, cint
from tools.custom_data_methods import get_user_branch

def formated_date(date_str):
	return  datetime.datetime.strptime(date_str , '%d-%m-%Y').strftime('%Y-%m-%d')

@frappe.whitelist()
def get_sales_cond(args):
	cond = "1=1"
	if args.get('from_date') and args.get('to_date'):
		cond += """	and s.posting_date between coalesce('%s','1111-09-01 14:49:40') and 
				coalesce('%s','9999-09-01 14:49:40')"""%(formated_date(args.get('from_date')), formated_date(args.get('to_date')))	

	if args.get('branch'):
		cond += """ and si.sales_invoice_branch = '%s' """%(args.get('branch'))

	if args.get('fiscal_year'):
		cond += """	and s.fiscal_year = '%s' """%(args.get('fiscal_year'))

	return cond

@frappe.whitelist()
def get_data_for_account_dashboard(args):
	args = eval(args)
	if args.get('type_of_group')=='All':
		data = get_all_details(args)
	else:
		data = get_data_for_pie_chart(args, args.get('type_of_group'))
	return data
	
def get_all_details(args):
	item_group_dict = [['branch', 'Tailoring', 'Merchandise']]
	cond = get_sales_cond(args)
	data = frappe.db.sql("""SELECT CONCAT(branch, ': ', format(SUM(purchase_amount),2)) AS 'total',
						    	SUM(
							        CASE WHEN foo.item_group='Tailoring'
							            THEN purchase_amount
							            ELSE 0
							        END) AS 'tailoring',
							    SUM(
							        CASE WHEN foo.item_group='Merchandise'
							            THEN purchase_amount
							            ELSE 0
							        END) AS 'merchandise'
						FROM
						    (
						        SELECT si.sales_invoice_branch AS branch, si.amount AS purchase_amount, si.item_group AS item_group
						        FROM
						            `tabSales Invoice Item` si, `tabSales Invoice` s
						        WHERE si.docstatus = 1 AND si.parent=s.name AND ifnull(s.outstanding_amount,0)=0 AND %s
						        GROUP BY si.sales_invoice_branch, si.item_group) AS foo
						GROUP BY
						    branch"""%(cond), as_dict = 1)
	for d in data:
		item_group_dict.append([d.total, d.tailoring, d.merchandise])
	tailoring_data = get_data_for_pie_chart(args, 'Tailoring')
	merchandise_data = get_data_for_pie_chart(args, 'Merchandise')
	return item_group_dict, tailoring_data, merchandise_data

def get_data_for_pie_chart(args, item_group):
	pie_chart_dict = [['branch','value']]
	cond = get_sales_cond(args)
	data = frappe.db.sql("""SELECT si.sales_invoice_branch AS branch, si.amount AS purchase_amount
							FROM
    							`tabSales Invoice Item` si, `tabSales Invoice` s
							WHERE
    							si.docstatus = 1 AND si.parent=s.name 
    							AND ifnull(s.outstanding_amount,0)=0 
    							AND si.item_group = '%s' AND %s
							GROUP BY
    							si.sales_invoice_branch,si.item_group"""%(item_group, cond), as_dict=1)
	for d in data:
		pie_chart_dict.append([d.branch, d.purchase_amount])

	return pie_chart_dict

@frappe.whitelist()
def get_data_for_attendance(from_date):
	cond = "a.att_date = '%s'"%(datetime.datetime.now().strftime('%Y-%m-%d'))
	if from_date:
		cond = "a.att_date = '%s'"%(formated_date(from_date))
	attendance_graphData_list = [['branch','Present', 'Absent', 'Half Day','Unsigned User']]
	attendance_details = frappe.db.sql("""select concat(branch,':',branch_count) as branch_count,present,absent,half_day,(branch_count-total_signed) as unsigned_count from(
							SELECT
							   b.name as branch,    
							   (select COUNT(*) FROM `tabEmployee` WHERE branch=b.name) as branch_count,
							   (select count(*) from tabAttendance a,tabEmployee e where a.employee=e.name and e.branch=b.name and a.docstatus=1 and  %s ) as total_signed,
							   (select count(*) from tabAttendance a,tabEmployee e where a.employee=e.name and e.branch=b.name and a.docstatus=1 and  a.status='Present' and %s ) as present,
							   (select count(*) from tabAttendance a,tabEmployee e where a.employee=e.name and e.branch=b.name and a.docstatus=1 and  a.status='Absent' and %s ) as absent,
							   (select count(*) from tabAttendance a,tabEmployee e where a.employee=e.name and e.branch=b.name and a.docstatus=1 and  a.status='Half Day' and %s ) as half_day
							FROM
							   tabBranch b
							   )foo where branch_count > 0"""%(cond, cond, cond, cond), as_list=1)

	if attendance_details:
		for data in attendance_details:
			attendance_graphData_list.append([data[0], cint(data[1]), cint(data[2]), cint(data[3]), cint(data[4])])
	else:
		return None		
	return attendance_graphData_list

@frappe.whitelist()
def get_supplier_details():
	supplier =[['branch', 'amount']]
	cond = "1=1"
	if frappe.session.user != 'Administrator':
		cond = "branch = '%s'"%(get_user_branch())
	data = frappe.db.sql(""" SELECT supplier, sum(outstanding_amount)
							FROM
							    `tabPurchase Invoice`
							WHERE
							    docstatus=1 AND %s
							    and outstanding_amount > 0 GROUP by supplier"""%(cond), as_list=1)
	for d in data:
		supplier.append([d[0], d[1]])
	return supplier