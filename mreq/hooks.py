app_name = "mreq"
app_title = "Mreq"
app_publisher = "IndictransTech"
app_description = "Material Request Handler"
app_icon = "icon-exchange"
app_color = "#330033"
app_email = "saurabh6790@gmailc.om"
app_url = "test"
app_version = "0.0.1"

# Includes in <head>
# ------------------

fixtures = ['Custom Field', 'Property Setter', 'DocPerm']

# include js, css files in header of desk.html
# app_include_css = "/assets/mreq/css/mreq.css"
# app_include_js = "/assets/mreq/js/mreq.js"

# include js, css files in header of web template
# web_include_css = "/assets/mreq/css/mreq.css"
# web_include_js = "/assets/mreq/js/mreq.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "mreq.install.before_install"
# after_install = "mreq.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "mreq.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.core.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.core.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"mreq.tasks.all"
# 	],
# 	"daily": [
# 		"mreq.tasks.daily"
# 	],
# 	"hourly": [
# 		"mreq.tasks.hourly"
# 	],
# 	"weekly": [
# 		"mreq.tasks.weekly"
# 	]
# 	"monthly": [
# 		"mreq.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "mreq.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.core.doctype.event.event.get_events": "mreq.event.get_events"
# }

