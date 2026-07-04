from flask import Blueprint
from flask import request

from app.middleware.admin_required import admin_required

from app.services.admin_service import AdminService


admin_bp = Blueprint(

    "admin",

    __name__,

    url_prefix="/api/admin"

)


# ------------------------------------
# Company
# ------------------------------------

@admin_bp.route(

    "/company",

    methods=["GET"]

)
@admin_required
def company():

    return AdminService.get_company()


@admin_bp.route(

    "/company",

    methods=["PUT"]

)
@admin_required
def update_company():

    data = request.get_json()

    return AdminService.update_company(

        data

    )


# ------------------------------------
# Departments
# ------------------------------------

@admin_bp.route(

    "/departments",

    methods=["POST"]

)
@admin_required
def create_department():

    data = request.get_json()

    return AdminService.create_department(

        data

    )


@admin_bp.route(

    "/departments",

    methods=["GET"]

)
@admin_required
def get_departments():

    return AdminService.get_departments()


@admin_bp.route(

    "/departments/<department_id>",

    methods=["DELETE"]

)
@admin_required
def delete_department(department_id):

    return AdminService.delete_department(

        department_id

    )


# ------------------------------------
# Designations
# ------------------------------------

@admin_bp.route(

    "/designations",

    methods=["POST"]

)
@admin_required
def create_designation():

    data = request.get_json()

    return AdminService.create_designation(

        data

    )


@admin_bp.route(

    "/designations",

    methods=["GET"]

)
@admin_required
def get_designations():

    return AdminService.get_designations()


@admin_bp.route(

    "/designations/<designation_id>",

    methods=["DELETE"]

)
@admin_required
def delete_designation(designation_id):

    return AdminService.delete_designation(

        designation_id

    )


# ------------------------------------
# Reset Password
# ------------------------------------

@admin_bp.route(

    "/reset-password/<login_id>",

    methods=["PUT"]

)
@admin_required
def reset_password(login_id):

    return AdminService.reset_employee_password(

        login_id

    )