from flask import Blueprint, request

from app.middleware.auth_required import auth_required
from app.middleware.admin_required import admin_required

from app.services.dashboard_service import DashboardService


dashboard_bp = Blueprint(

    "dashboard",

    __name__,

    url_prefix="/api/dashboard"

)


# ----------------------------------------
# Employee Dashboard
# ----------------------------------------

@dashboard_bp.route(

    "/employee",

    methods=["GET"]

)
@auth_required
def employee_dashboard():

    return DashboardService.employee_dashboard(

        request.user["login_id"]

    )


# ----------------------------------------
# Admin Dashboard
# ----------------------------------------

@dashboard_bp.route(

    "/admin",

    methods=["GET"]

)
@admin_required
def admin_dashboard():

    return DashboardService.admin_dashboard()


# ----------------------------------------
# Recent Activity
# ----------------------------------------

@dashboard_bp.route(

    "/activity",

    methods=["GET"]

)
@admin_required
def recent_activity():

    return DashboardService.recent_activity()