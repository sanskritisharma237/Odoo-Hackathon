from datetime import datetime
from datetime import date

from app.extensions import mongo

from app.utils.response import success
from app.utils.response import error


class AttendanceService:
    @staticmethod
    def check_in(user, data):

        today = date.today().isoformat()

        attendance = mongo.db.attendance.find_one(
            {
                "login_id": user["login_id"],
                "date": today
            }
        )

        if attendance:

            return error(
                "Already checked in today",
                400
            )

        attendance = {

            "login_id": user["login_id"],

            "employee_name": user["employee_name"],

            "department": user["department"],

            "date": today,

            "check_in": datetime.utcnow(),

            "check_out": None,

            "status": "Present",

            "working_hours": 0,

            "remarks": data.get("remarks", ""),

            "latitude": data.get("latitude"),

            "longitude": data.get("longitude"),

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()

        }

        mongo.db.attendance.insert_one(attendance)

        return success(
            "Checked In Successfully"
        )
    @staticmethod
    def check_out(user, data):

        today = date.today().isoformat()

        attendance = mongo.db.attendance.find_one(
            {
                "login_id": user["login_id"],
                "date": today
            }
        )

        if attendance is None:

            return error(
                "Check In First",
                400
            )

        if attendance["check_out"]:

            return error(
                "Already Checked Out",
                400
            )

        checkout_time = datetime.utcnow()

        hours = (

            checkout_time -

            attendance["check_in"]

        ).total_seconds() / 3600

        mongo.db.attendance.update_one(

            {

                "_id": attendance["_id"]

            },

            {

                "$set": {

                    "check_out": checkout_time,

                    "working_hours": round(

                        hours,

                        2

                    ),

                    "remarks": data.get(

                        "remarks",

                        attendance["remarks"]

                    ),

                    "updated_at": datetime.utcnow()

                }

            }

        )

        return success(

            "Checked Out Successfully"

        )
    @staticmethod
    def today(user):

        attendance = mongo.db.attendance.find_one(

            {

                "login_id": user["login_id"],

                "date": date.today().isoformat()

            }

        )

        if attendance is None:

            return error(

                "Attendance Not Found",

                404

            )

        attendance["_id"] = str(

            attendance["_id"]

        )

        return success(

            "Today's Attendance",

            attendance

        )
    @staticmethod
    def history(user):

        cursor = mongo.db.attendance.find(

            {

                "login_id": user["login_id"]

            }

        ).sort(

            "date",

            -1

        )

        records = []

        for attendance in cursor:

            attendance["_id"] = str(

                attendance["_id"]

            )

            records.append(

                attendance

            )

        return success(

            "Attendance History",

            records

        )
    @staticmethod
    def monthly_attendance(user, month, year):

        cursor = mongo.db.attendance.find(

            {
                "login_id": user["login_id"],
                "date": {
                    "$regex": f"{year}-{str(month).zfill(2)}"
                }
            }

        ).sort("date", 1)

        records = []

        for attendance in cursor:

            attendance["_id"] = str(attendance["_id"])

            records.append(attendance)

        return success(

            "Monthly Attendance",

            records

        )


    @staticmethod
    def employee_attendance(login_id):

        cursor = mongo.db.attendance.find(

            {

                "login_id": login_id

            }

        ).sort(

            "date",

            -1

        )

        records = []

        for attendance in cursor:

            attendance["_id"] = str(

                attendance["_id"]

            )

            records.append(

                attendance

            )

        return success(

            "Employee Attendance",

            records

        )


    @staticmethod
    def all_attendance():

        cursor = mongo.db.attendance.find().sort(

            "date",

            -1

        )

        records = []

        for attendance in cursor:

            attendance["_id"] = str(

                attendance["_id"]

            )

            records.append(

                attendance

            )

        return success(

            "Attendance Records",

            records

        )


    @staticmethod
    def attendance_statistics(login_id):

        cursor = mongo.db.attendance.find(

            {

                "login_id": login_id

            }

        )

        total_days = 0

        total_hours = 0

        present = 0

        absent = 0

        leave = 0

        half_day = 0

        for attendance in cursor:

            total_days += 1

            total_hours += attendance.get(

                "working_hours",

                0

            )

            status = attendance.get(

                "status",

                "Present"

            )

            if status == "Present":

                present += 1

            elif status == "Absent":

                absent += 1

            elif status == "Leave":

                leave += 1

            elif status == "Half Day":

                half_day += 1

        statistics = {

            "total_days": total_days,

            "present": present,

            "absent": absent,

            "leave": leave,

            "half_day": half_day,

            "total_working_hours": round(

                total_hours,

                2

            )

        }

        return success(

            "Attendance Statistics",

            statistics

        )


    @staticmethod
    def update_attendance(attendance_id, data):

        from bson import ObjectId

        attendance = mongo.db.attendance.find_one(

            {

                "_id": ObjectId(attendance_id)

            }

        )

        if attendance is None:

            return error(

                "Attendance Record Not Found",

                404

            )

        updates = {}

        editable_fields = [

            "status",

            "remarks",

            "check_in",

            "check_out",

            "working_hours"

        ]

        for field in editable_fields:

            if field in data:

                updates[field] = data[field]

        updates["updated_at"] = datetime.utcnow()

        mongo.db.attendance.update_one(

            {

                "_id": attendance["_id"]

            },

            {

                "$set": updates

            }

        )

        return success(

            "Attendance Updated"

        )


    @staticmethod
    def delete_attendance(attendance_id):

        from bson import ObjectId

        attendance = mongo.db.attendance.find_one(

            {

                "_id": ObjectId(attendance_id)

            }

        )

        if attendance is None:

            return error(

                "Attendance Record Not Found",

                404

            )

        mongo.db.attendance.delete_one(

            {

                "_id": attendance["_id"]

            }

        )

        return success(

            "Attendance Deleted Successfully"

        )