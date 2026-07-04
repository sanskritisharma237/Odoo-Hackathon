from datetime import datetime

from bson import ObjectId

from app.extensions import mongo

from app.utils.response import success
from app.utils.response import error


class LeaveService:
    @staticmethod
    def apply_leave(user, data):

        leave = {

            "login_id": user["login_id"],

            "employee_name": user["employee_name"],

            "department": user["department"],

            "leave_type": data["leave_type"],

            "start_date": data["start_date"],

            "end_date": data["end_date"],

            "reason": data["reason"],

            "status": "Pending",

            "admin_remarks": "",

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()

        }

        mongo.db.leave_requests.insert_one(

            leave

        )

        return success(

            "Leave Applied Successfully",

            leave,

            201

        )
    @staticmethod
    def leave_history(user):

        cursor = mongo.db.leave_requests.find(

            {

                "login_id": user["login_id"]

            }

        ).sort(

            "created_at",

            -1

        )

        leaves = []

        for leave in cursor:

            leave["_id"] = str(

                leave["_id"]

            )

            leaves.append(

                leave

            )

        return success(

            "Leave History",

            leaves

        )
    @staticmethod
    def get_leave(leave_id):

        try:

            leave = mongo.db.leave_requests.find_one(

                {

                    "_id": ObjectId(

                        leave_id

                    )

                }

            )

        except Exception:

            return error(

                "Invalid Leave ID",

                400

            )

        if leave is None:

            return error(

                "Leave Not Found",

                404

            )

        leave["_id"] = str(

            leave["_id"]

        )

        return success(

            "Leave Details",

            leave

        )
    @staticmethod
    def cancel_leave(user, leave_id):

        try:

            leave = mongo.db.leave_requests.find_one(

                {

                    "_id": ObjectId(

                        leave_id

                    )

                }

            )

        except Exception:

            return error(

                "Invalid Leave ID",

                400

            )

        if leave is None:

            return error(

                "Leave Not Found",

                404

            )

        if leave["login_id"] != user["login_id"]:

            return error(

                "Unauthorized",

                403

            )

        if leave["status"] != "Pending":

            return error(

                "Approved Leave Cannot Be Cancelled",

                400

            )

        mongo.db.leave_requests.delete_one(

            {

                "_id": leave["_id"]

            }

        )

        return success(

            "Leave Cancelled"

        )
    @staticmethod
    def all_leave_requests():

        cursor = mongo.db.leave_requests.find().sort(

            "created_at",

            -1

        )

        leaves = []

        for leave in cursor:

            leave["_id"] = str(

                leave["_id"]

            )

            leaves.append(

                leave

            )

        return success(

            "Leave Requests",

            leaves

        )
    @staticmethod
    def approve_leave(leave_id, remarks=""):

        try:

            leave = mongo.db.leave_requests.find_one(
                {
                    "_id": ObjectId(leave_id)
                }
            )

        except Exception:

            return error(
                "Invalid Leave ID",
                400
            )

        if leave is None:

            return error(
                "Leave Request Not Found",
                404
            )

        if leave["status"] != "Pending":

            return error(
                "Leave Already Processed",
                400
            )

        mongo.db.leave_requests.update_one(

            {
                "_id": leave["_id"]
            },

            {
                "$set": {

                    "status": "Approved",

                    "admin_remarks": remarks,

                    "updated_at": datetime.utcnow()

                }

            }

        )

        return success(
            "Leave Approved Successfully"
        )


    @staticmethod
    def reject_leave(leave_id, remarks=""):

        try:

            leave = mongo.db.leave_requests.find_one(
                {
                    "_id": ObjectId(leave_id)
                }
            )

        except Exception:

            return error(
                "Invalid Leave ID",
                400
            )

        if leave is None:

            return error(
                "Leave Request Not Found",
                404
            )

        if leave["status"] != "Pending":

            return error(
                "Leave Already Processed",
                400
            )

        mongo.db.leave_requests.update_one(

            {
                "_id": leave["_id"]
            },

            {
                "$set": {

                    "status": "Rejected",

                    "admin_remarks": remarks,

                    "updated_at": datetime.utcnow()

                }

            }

        )

        return success(
            "Leave Rejected Successfully"
        )


    @staticmethod
    def update_leave(leave_id, data):

        try:

            leave = mongo.db.leave_requests.find_one(
                {
                    "_id": ObjectId(leave_id)
                }
            )

        except Exception:

            return error(
                "Invalid Leave ID",
                400
            )

        if leave is None:

            return error(
                "Leave Request Not Found",
                404
            )

        updates = {}

        editable_fields = [

            "leave_type",

            "start_date",

            "end_date",

            "reason"

        ]

        for field in editable_fields:

            if field in data:

                updates[field] = data[field]

        updates["updated_at"] = datetime.utcnow()

        mongo.db.leave_requests.update_one(

            {
                "_id": leave["_id"]
            },

            {
                "$set": updates
            }

        )

        return success(
            "Leave Updated Successfully"
        )


    @staticmethod
    def leave_statistics(login_id):

        cursor = mongo.db.leave_requests.find(
            {
                "login_id": login_id
            }
        )

        total = 0

        pending = 0

        approved = 0

        rejected = 0

        for leave in cursor:

            total += 1

            status = leave["status"]

            if status == "Pending":

                pending += 1

            elif status == "Approved":

                approved += 1

            elif status == "Rejected":

                rejected += 1

        return success(

            "Leave Statistics",

            {

                "total": total,

                "pending": pending,

                "approved": approved,

                "rejected": rejected

            }

        )


    @staticmethod
    def filter_leave(status):

        cursor = mongo.db.leave_requests.find(

            {
                "status": status
            }

        ).sort(

            "created_at",

            -1

        )

        leaves = []

        for leave in cursor:

            leave["_id"] = str(

                leave["_id"]

            )

            leaves.append(

                leave

            )

        return success(

            "Filtered Leave Requests",

            leaves

        )