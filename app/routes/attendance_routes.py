from flask import Blueprint
from flask import request

from app.services.attendance_service import AttendanceService

from app.middleware.auth_required import auth_required
from app.middleware.admin_required import admin_required


attendance_bp = Blueprint(

    "attendance",

    __name__,

    url_prefix="/api/attendance"

)


# --------------------------------------------------
# Employee Check In
# --------------------------------------------------

@attendance_bp.route(

    "/check-in",

    methods=["POST"]

)
@auth_required
def check_in():

    data = request.get_json() or {}

    return AttendanceService.check_in(

        request.user,

        data

    )


# --------------------------------------------------
# Employee Check Out
# --------------------------------------------------

@attendance_bp.route(

    "/check-out",

    methods=["POST"]

)
@auth_required
def check_out():

    data = request.get_json() or {}

    return AttendanceService.check_out(

        request.user,

        data

    )


# --------------------------------------------------
# Today's Attendance
# --------------------------------------------------

@attendance_bp.route(

    "/today",

    methods=["GET"]

)
@auth_required
def today():

    return AttendanceService.today(

        request.user

    )


# --------------------------------------------------
# Attendance History
# --------------------------------------------------

@attendance_bp.route(

    "/history",

    methods=["GET"]

)
@auth_required
def history():

    return AttendanceService.history(

        request.user

    )


# --------------------------------------------------
# Monthly Attendance
# --------------------------------------------------

@attendance_bp.route(

    "/monthly",

    methods=["GET"]

)
@auth_required
def monthly_attendance():

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

    return AttendanceService.monthly_attendance(

        request.user,

        month,

        year

    )


# --------------------------------------------------
# Employee Attendance Statistics
# --------------------------------------------------

@attendance_bp.route(

    "/statistics",

    methods=["GET"]

)
@auth_required
def attendance_statistics():

    return AttendanceService.attendance_statistics(

        request.user["login_id"]

    )


# --------------------------------------------------
# Admin - View All Attendance
# --------------------------------------------------

@attendance_bp.route(

    "",

    methods=["GET"]

)
@admin_required
def all_attendance():

    return AttendanceService.all_attendance()


# --------------------------------------------------
# Admin - Attendance Of One Employee
# --------------------------------------------------

@attendance_bp.route(

    "/employee/<login_id>",

    methods=["GET"]

)
@admin_required
def employee_attendance(login_id):

    return AttendanceService.employee_attendance(

        login_id

    )


# --------------------------------------------------
# Admin - Update Attendance
# --------------------------------------------------

@attendance_bp.route(

    "/<attendance_id>",

    methods=["PUT"]

)
@admin_required
def update_attendance(attendance_id):

    data = request.get_json() or {}

    return AttendanceService.update_attendance(

        attendance_id,

        data

    )


# --------------------------------------------------
# Admin - Delete Attendance
# --------------------------------------------------

@attendance_bp.route(

    "/<attendance_id>",

    methods=["DELETE"]

)
@admin_required
def delete_attendance(attendance_id):

    return AttendanceService.delete_attendance(

        attendance_id

    )