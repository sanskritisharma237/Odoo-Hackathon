from datetime import date

from app.extensions import mongo

from app.utils.response import success


class DashboardService:

    @staticmethod
    def employee_dashboard(login_id):

        user = mongo.db.users.find_one(

            {

                "login_id": login_id

            },

            {

                "password": 0

            }

        )

        today = date.today().isoformat()

        attendance = mongo.db.attendance.find_one(

            {

                "login_id": login_id,

                "date": today

            }

        )

        pending_leave = mongo.db.leave_requests.count_documents(

            {

                "login_id": login_id,

                "status": "Pending"

            }

        )

        approved_leave = mongo.db.leave_requests.count_documents(

            {

                "login_id": login_id,

                "status": "Approved"

            }

        )

        latest_payroll = mongo.db.payroll.find_one(

            {

                "login_id": login_id

            },

            sort=[

                (

                    "created_at",

                    -1

                )

            ]

        )

        dashboard = {

            "employee": user,

            "attendance": attendance,

            "pending_leave": pending_leave,

            "approved_leave": approved_leave,

            "latest_salary": latest_payroll

        }

        return success(

            "Employee Dashboard",

            dashboard

        )


    @staticmethod
    def admin_dashboard():

        dashboard = {

            "employees": mongo.db.users.count_documents({}),

            "attendance_today": mongo.db.attendance.count_documents(

                {

                    "date": date.today().isoformat()

                }

            ),

            "pending_leave": mongo.db.leave_requests.count_documents(

                {

                    "status": "Pending"

                }

            ),

            "approved_leave": mongo.db.leave_requests.count_documents(

                {

                    "status": "Approved"

                }

            ),

            "monthly_payroll": mongo.db.payroll.count_documents({})

        }

        return success(

            "Admin Dashboard",

            dashboard

        )


    @staticmethod
    def recent_activity():

        attendance = list(

            mongo.db.attendance.find().sort(

                "created_at",

                -1

            ).limit(5)

        )

        leave = list(

            mongo.db.leave_requests.find().sort(

                "created_at",

                -1

            ).limit(5)

        )

        payroll = list(

            mongo.db.payroll.find().sort(

                "created_at",

                -1

            ).limit(5)

        )

        for collection in [

            attendance,

            leave,

            payroll

        ]:

            for item in collection:

                item["_id"] = str(

                    item["_id"]

                )

        return success(

            "Recent Activity",

            {

                "attendance": attendance,

                "leave": leave,

                "payroll": payroll

            }

        )