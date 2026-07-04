from flask import Blueprint
from flask import request

from app.services.employee_service import EmployeeService

from app.middleware.auth_required import auth_required
from app.middleware.admin_required import admin_required


employee_bp = Blueprint(

    "employee",

    __name__,

    url_prefix="/api/employees"

)


# --------------------------------------------------
# Create Employee (Admin Only)
# --------------------------------------------------

@employee_bp.route(

    "",

    methods=["POST"]

)
@admin_required
def create_employee():

    data = request.form.to_dict()

    profile_picture = request.files.get(

        "profile_picture"

    )

    return EmployeeService.create_employee(

        data,

        profile_picture

    )


# --------------------------------------------------
# List Employees
# --------------------------------------------------

@employee_bp.route(

    "",

    methods=["GET"]

)
@admin_required
def get_all_employees():

    return EmployeeService.get_all_employees()


# --------------------------------------------------
# Search Employee
# --------------------------------------------------

@employee_bp.route(

    "/search",

    methods=["GET"]

)
@admin_required
def search_employee():

    keyword = request.args.get(

        "keyword",

        ""

    )

    return EmployeeService.search_employee(

        keyword

    )


# --------------------------------------------------
# Employee by ID
# --------------------------------------------------

@employee_bp.route(

    "/<employee_id>",

    methods=["GET"]

)
@admin_required
def get_employee(employee_id):

    return EmployeeService.get_employee(

        employee_id

    )


# --------------------------------------------------
# Update Employee
# --------------------------------------------------

@employee_bp.route(

    "/<employee_id>",

    methods=["PUT"]

)
@admin_required
def update_employee(employee_id):

    data = request.get_json()

    return EmployeeService.update_employee(

        employee_id,

        data

    )


# --------------------------------------------------
# Delete Employee
# --------------------------------------------------

@employee_bp.route(

    "/<employee_id>",

    methods=["DELETE"]

)
@admin_required
def delete_employee(employee_id):

    return EmployeeService.delete_employee(

        employee_id

    )


# --------------------------------------------------
# Department Employees
# --------------------------------------------------

@employee_bp.route(

    "/department/<department>",

    methods=["GET"]

)
@admin_required
def department_employees(department):

    return EmployeeService.get_department_employees(

        department

    )


# --------------------------------------------------
# Toggle Active / Inactive
# --------------------------------------------------

@employee_bp.route(

    "/<employee_id>/status",

    methods=["PATCH"]

)
@admin_required
def toggle_status(employee_id):

    return EmployeeService.toggle_employee_status(

        employee_id

    )


# --------------------------------------------------
# Upload New Profile Picture
# --------------------------------------------------

@employee_bp.route(

    "/<employee_id>/profile-picture",

    methods=["PUT"]

)
@auth_required
def update_profile_picture(employee_id):

    picture = request.files.get(

        "profile_picture"

    )

    return EmployeeService.update_profile_picture(

        employee_id,

        picture

    )


# --------------------------------------------------
# Logged In Employee Profile
# --------------------------------------------------

@employee_bp.route(

    "/profile",

    methods=["GET"]

)
@auth_required
def profile():

    return EmployeeService.get_profile(

        request.user["login_id"]

    )