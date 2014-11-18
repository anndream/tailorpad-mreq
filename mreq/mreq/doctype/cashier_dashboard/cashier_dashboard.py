# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import cint, cstr, flt, nowdate, now
from frappe.model.document import Document
from frappe import _, msgprint, throw
from tools.custom_data_methods import get_user_branch, get_branch_cost_center

class CashierDashboard(Document):
	def validate_methods(self, args):
		self.check_measurement_noted(args)
		self.mandatory_fields_validation(args)
		self.validate_authentication(args)

	def check_measurement_noted(self, args):
		if args.measurement != 'Noted':
			frappe.throw(_("For Order {0} at row {1} Measurement is not noted").format(args.sales_invoice_no, args.idx))

	def mandatory_fields_validation(self, args):
		validation_mapper = {'Sales Invoice No': args.sales_invoice_no,'Payment Account': args.payment_account, 'Reference Number': args.reference_number, 'Reference Date': args.reference_date, 'Amount': args.amount}
		for s in validation_mapper:
			if not validation_mapper[s]:
				frappe.throw('Mandatory Fields: Select field "%s" at row %s'%(s, args.idx))
		return "Done"

	def validate_authentication(self, args):
		if frappe.db.get_value('Sales Invoice', args.sales_invoice_no, 'authenticated') == 'Approved' and args.status in ['Pending', 'Rejected', 'Remove'] : 
			frappe.throw(_('This order is already approved'))

	def make_payment(self):
		branch = get_user_branch()
		min_payment = frappe.db.get_value('Branch', branch, 'min_advance_payment')
		for d in self.get('payment'):
			if cint(d.select) == 1 and cint(d.outstanding) > 0:
				self.validate_methods(d)
				jv = self.create_jv(d)
				self.authenticate_for_production(d)
			# elif d.status == 'Rejected':
			# 	frappe.throw(_('You have to pay minimum amount {0}').format(min_payment))
		self.show_pending_balance_invoices()
		return "Successfully received amount"

	def create_jv(self, args):
		jv = frappe.new_doc('Journal Voucher')
		jv.voucher_type = 'Bank Voucher'
		jv.cheque_no = args.reference_number
		jv.posting_date = '2014-12-11-'
		jv.cheque_date = args.reference_date
		jv.save(ignore_permissions=True)
		other_details = [{'account':frappe.db.get_value('Sales Invoice', args.sales_invoice_no,'debit_to'),'account_type':'credit', 'payment':args.amount, 'invoice': args.sales_invoice_no},{'account':args.payment_account,'account_type':'debit', 'payment':args.amount,'invoice':''}]
		self.make_gl_entry(jv.name, other_details, args.amount, args.outstanding)
		jv = frappe.get_doc('Journal Voucher', jv.name)
		jv.submit()
		return jv.name

	def make_gl_entry(self, parent, args, amount, outstanding):
		for s in args:
			amount = self.adjust_amount(amount, outstanding)
			jvd = frappe.new_doc('Journal Voucher Detail')
			jvd.parent = parent
			jvd.parenttype = 'Journal Voucher'
			jvd.parentfield = 'entries'
			jvd.cost_center = get_branch_cost_center(get_user_branch())
			jvd.account = s.get('account')
			if s.get('account_type') == 'credit':
				jvd.credit = cstr(amount)
			else:
				jvd.debit = cstr(amount)
			jvd.against_invoice = s.get('invoice')
			jvd.save()
		return "Done"

	def adjust_amount(self, amt, outstanding):
		if flt(amt) > flt(outstanding):
			return outstanding
		else:
			return flt(amt)

	def show_pending_balance_invoices(self):
		self.set('payment',[])
		cond = "1=1"
		if frappe.session.user !='Administrator':
			cond = "branch='%s'"%(get_user_branch())
		
		data = frappe.db.sql("""select * from `tabSales Invoice` where 
			docstatus= 1 and ifnull(outstanding_amount, 0)>0 
			and %s"""%(cond), as_dict=1)
		
		for r in data:
			pmt = self.append('payment',{})
			pmt.sales_invoice_no = r.name
			pmt.customer = r.customer
			pmt.outstanding = r.outstanding_amount
			pmt.status = 'Pending' if not r.authenticated else r.authenticated
			pmt.measurement = self.get_remaining_measurement_list(r.name)

	def authenticate_for_production(self, args):
		branch = get_user_branch()
		if branch:
			min_payment = frappe.db.get_value('Branch', branch, 'min_advance_payment')
			if cint(args.select) == 1 and frappe.db.get_value('Sales Invoice', args.sales_invoice_no, 'authenticated')!='Approved':
				if flt(args.amount) < flt(min_payment) and args.status=='Approved':
					frappe.throw(_('Must pay minimum amount {0}').format(min_payment))
				else:
					frappe.db.sql("""update `tabSales Invoice` set authenticated = '%s' 
						where name = '%s'"""%(args.status, args.sales_invoice_no))

	def calculate_status(self, idx):
		for d in self.get('payment'):
			if cint(d.idx) == cint(idx):
				min_payment = frappe.db.get_value('Branch', get_user_branch(), 'min_advance_payment')
				if flt(d.amount) < flt(min_payment) and not frappe.db.get_value('Sales Invoice', d.sales_invoice_no, 'authenticated'):
					d.status = 'Rejected'
				elif not frappe.db.get_value('Sales Invoice', d.sales_invoice_no, 'authenticated'):
					d.status = 'Approved'
		return "Done"

	def get_remaining_measurement_list(self, invoice_no):
		wo_name = frappe.db.sql("""select name from `tabWork Order` where name
		 in (select tailor_work_order from `tabWork Order Distribution` where parent = '%s') 
		 and docstatus=0 """%(invoice_no), as_list=1)
		if wo_name:
			return "Pending"
		return "Noted"