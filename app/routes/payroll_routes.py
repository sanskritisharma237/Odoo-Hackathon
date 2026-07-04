from flask import Blueprint
from flask import request

from app.services.payroll_service import PayrollService

from app.middleware.auth_required import auth_required
from app.middleware.admin_required import admin_required


payroll_bp = Blueprint(

    "payroll",

    __name__,

    url_prefix="/api/payroll"

)


# --------------------------------------------------
# Employee Current Salary
# --------------------------------------------------

@payroll_bp.route(

    "/current",

    methods=["GET"]

)
@auth_required
def current_salary():

    return PayrollService.current_salary(

        request.user["login_id"]

    )


# --------------------------------------------------
# Employee Salary History
# --------------------------------------------------

@payroll_bp.route(

    "/history",

    methods=["GET"]

)
@auth_required
def salary_history():

    return PayrollService.salary_history(

        request.user["login_id"]

    )


# --------------------------------------------------
# Employee Payslip
# --------------------------------------------------

@payroll_bp.route(

    "/payslip/<payroll_id>",

    methods=["GET"]

)
@auth_required
def generate_payslip(payroll_id):

    return PayrollService.generate_payslip(

        payroll_id

    )


# --------------------------------------------------
# Admin Create Payroll
# --------------------------------------------------

@payroll_bp.route(

    "/<login_id>",

    methods=["POST"]

)
@admin_required
def create_payroll(login_id):

    data = request.get_json() or {}

    return PayrollService.create_payroll(

        login_id,

        data

    )


# --------------------------------------------------
# Admin Payroll Details
# --------------------------------------------------

@payroll_bp.route(

    "/record/<payroll_id>",

    methods=["GET"]

)
@admin_required
def get_payroll(payroll_id):

    return PayrollService.get_payroll(

        payroll_id

    )


# --------------------------------------------------
# Admin Update Payroll
# --------------------------------------------------

@payroll_bp.route(

    "/record/<payroll_id>",

    methods=["PUT"]

)
@admin_required
def update_payroll(payroll_id):

    data = request.get_json() or {}

    return PayrollService.update_payroll(

        payroll_id,

        data

    )


# --------------------------------------------------
# Admin Delete Payroll
# --------------------------------------------------

@payroll_bp.route(

    "/record/<payroll_id>",

    methods=["DELETE"]

)
@admin_required
def delete_payroll(payroll_id):

    return PayrollService.delete_payroll(

        payroll_id

    )


# --------------------------------------------------
# Admin Monthly Payroll
# --------------------------------------------------

@payroll_bp.route(

    "/monthly",

    methods=["GET"]

)
@admin_required
def monthly_payroll():

    month = int(

        request.args.get(

            "month"

        )

    )

    year = int(

        request.args.get(

            "year"

        )

    )

    return PayrollService.monthly_payroll(

        month,

        year

    )


# --------------------------------------------------
# Admin Payroll Statistics
# --------------------------------------------------

@payroll_bp.route(

    "/statistics",

    methods=["GET"]

)
@admin_required
def payroll_statistics():

    return PayrollService.payroll_statistics()


# --------------------------------------------------
# Admin Employee Payroll Report
# --------------------------------------------------

@payroll_bp.route(

    "/employee/<login_id>",

    methods=["GET"]

)
@admin_required
def employee_report(login_id):

    return PayrollService.employee_report(

        login_id

    )