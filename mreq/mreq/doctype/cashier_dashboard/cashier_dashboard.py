# Copyright (c) 2013, IndictransTech and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import cint, cstr, flt
from frappe.model.document import Document

class CashierDashboard(Document):
	def get_outstanding_details(self, invoice_no):
		for d in self.get('payment'):
			if d.sales_invoice_no == invoice_no:
				d.outstanding = frappe.db.get_value('Sales Invoice', invoice_no, 'outstanding_amount')
				if cint(d.min_payment) < 0 or not d.min_payment:
					d.status = 'Pending'
		return "Done"

	def make_payment(self):
		for d in self.get('payment'):
			if cint(d.select) == 1 and cint(d.outstanding) > 0 and d.amount and d.sales_invoice_no:
				jv = self.create_jv(d)
				self.create_payment_log(d, jv)

	def create_jv(self, args):
		jv = frappe.new_doc('Journal Voucher')
		jv.voucher_type = 'Bank Voucher'
		jv.cheque_no = args.reference_number
		jv.cheque_date = args.reference_date
		jv.save(ignore_permissions=True)
		other_details = [{'account':frappe.db.get_value('Sales Invoice', args.sales_invoice_no,'debit_to'),'account_type':'credit', 'payment':args.amount, 'invoice': args.sales_invoice_no},{'account':args.payment_account,'account_type':'debit', 'payment':args.amount,'invoice':''}]
		self.make_gl_entry(jv.name, other_details, args.amount)
		jv = frappe.get_doc('Journal Voucher', jv.name)
		jv.submit()
		return jv.name

	def make_gl_entry(self, parent, args, amount):
		for s in args:
			jvd = frappe.new_doc('Journal Voucher Detail')
			jvd.parent = parent
			jvd.parenttype = 'Journal Voucher'
			jvd.parentfield = 'entries'
			jvd.account = args.get('account')
			if args.get('account_type') == 'credit':
				jvd.credit = amount
			else:
				jvd.debit = amount
			jvd.against_invoice = args.get('invoice')
			jvd.save()
		return "Done"

	def create_payment_log(self, args, jv):
		log = frappe.new_doc('Cashier Payment Log')