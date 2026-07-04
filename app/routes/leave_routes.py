from flask import Blueprint
from flask import request

from app.services.leave_service import LeaveService

from app.middleware.auth_required import auth_required
from app.middleware.admin_required import admin_required


leave_bp = Blueprint(

    "leave",

    __name__,

    url_prefix="/api/leave"

)


# --------------------------------------------------
# Apply Leave
# --------------------------------------------------

@leave_bp.route(

    "/apply",

    methods=["POST"]

)
@auth_required
def apply_leave():

    data = request.get_json() or {}

    return LeaveService.apply_leave(

        request.user,

        data

    )


# --------------------------------------------------
# Employee Leave History
# --------------------------------------------------

@leave_bp.route(

    "/history",

    methods=["GET"]

)
@auth_required
def leave_history():

    return LeaveService.leave_history(

        request.user

    )


# --------------------------------------------------
# Leave Statistics
# --------------------------------------------------

@leave_bp.route(

    "/statistics",

    methods=["GET"]

)
@auth_required
def leave_statistics():

    return LeaveService.leave_statistics(

        request.user["login_id"]

    )


# --------------------------------------------------
# View Single Leave
# --------------------------------------------------

@leave_bp.route(

    "/<leave_id>",

    methods=["GET"]

)
@auth_required
def get_leave(leave_id):

    return LeaveService.get_leave(

        leave_id

    )


# --------------------------------------------------
# Update Leave
# --------------------------------------------------

@leave_bp.route(

    "/<leave_id>",

    methods=["PUT"]

)
@auth_required
def update_leave(leave_id):

    data = request.get_json() or {}

    return LeaveService.update_leave(

        leave_id,

        data

    )


# --------------------------------------------------
# Cancel Leave
# --------------------------------------------------

@leave_bp.route(

    "/<leave_id>",

    methods=["DELETE"]

)
@auth_required
def cancel_leave(leave_id):

    return LeaveService.cancel_leave(

        request.user,

        leave_id

    )


# --------------------------------------------------
# Admin - All Leave Requests
# --------------------------------------------------

@leave_bp.route(

    "/admin",

    methods=["GET"]

)
@admin_required
def all_leave_requests():

    return LeaveService.all_leave_requests()


# --------------------------------------------------
# Admin - Approve Leave
# --------------------------------------------------

@leave_bp.route(

    "/approve/<leave_id>",

    methods=["PUT"]

)
@admin_required
def approve_leave(leave_id):

    data = request.get_json() or {}

    remarks = data.get(

        "remarks",

        ""

    )

    return LeaveService.approve_leave(

        leave_id,

        remarks

    )


# --------------------------------------------------
# Admin - Reject Leave
# --------------------------------------------------

@leave_bp.route(

    "/reject/<leave_id>",

    methods=["PUT"]

)
@admin_required
def reject_leave(leave_id):

    data = request.get_json() or {}

    remarks = data.get(

        "remarks",

        ""

    )

    return LeaveService.reject_leave(

        leave_id,

        remarks

    )


# --------------------------------------------------
# Admin - Filter Leave
# --------------------------------------------------

@leave_bp.route(

    "/filter",

    methods=["GET"]

)
@admin_required
def filter_leave():

    status = request.args.get(

        "status",

        "Pending"

    )

    return LeaveService.filter_leave(

        status

    )