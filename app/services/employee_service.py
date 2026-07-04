from datetime import datetime

from bson import ObjectId

from app.extensions import mongo
from app.extensions import bcrypt

from app.utils.response import success
from app.utils.response import error

from app.services.password_generator import generate_password
from app.services.login_id_generator import generate_login_id
from app.services.upload_service import upload_profile_picture


class EmployeeService:
    @staticmethod
    def create_employee(data, profile_picture):

        existing = mongo.db.users.find_one(
            {
                "email": data["email"]
            }
        )

        if existing:
            return error(
                "Email already exists",
                409
            )

        company = mongo.db.company.find_one()

        if company is None:
            return error(
                "Company is not configured",
                400
            )

        temporary_password = generate_password()

        hashed_password = bcrypt.generate_password_hash(
            temporary_password
        ).decode("utf-8")

        picture = upload_profile_picture(
            profile_picture
        )

        login_id = generate_login_id(
            company["company_short"],
            data["employee_name"]
        )

        employee = {

            "login_id": login_id,

            "employee_name": data["employee_name"],

            "email": data["email"],

            "phone": data["phone"],

            "department": data["department"],

            "designation": data["designation"],

            "joining_year": datetime.now().year,

            "role": data.get(
                "role",
                "Employee"
            ),

            "password": hashed_password,

            "profile_picture": picture,

            "first_login": True,

            "is_active": True,

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()

        }

        mongo.db.users.insert_one(employee)

        return success(

            "Employee Created Successfully",

            {

                "login_id": login_id,

                "temporary_password": temporary_password

            },

            201

        )
    @staticmethod
    def get_all_employees():

        employees = []

        cursor = mongo.db.users.find(
            {},
            {
                "password": 0
            }
        )

        for employee in cursor:

            employee["_id"] = str(employee["_id"])

            employees.append(employee)

        return success(

            "Employees fetched successfully",

            employees

        )
    @staticmethod
    def get_employee(employee_id):

        try:

            employee = mongo.db.users.find_one(

                {

                    "_id": ObjectId(employee_id)

                },

                {

                    "password": 0

                }

            )

        except Exception:

            return error(

                "Invalid Employee ID",

                400

            )

        if employee is None:

            return error(

                "Employee not found",

                404

            )

        employee["_id"] = str(employee["_id"])

        return success(

            "Employee Found",

            employee

        )
    @staticmethod
    def update_employee(employee_id, data):

        try:

            employee = mongo.db.users.find_one(
                {
                    "_id": ObjectId(employee_id)
                }
            )

        except Exception:

            return error(
                "Invalid Employee ID",
                400
            )

        if employee is None:

            return error(
                "Employee not found",
                404
            )

        updates = {}

        fields = [

            "employee_name",

            "email",

            "phone",

            "department",

            "designation",

            "role"

        ]

        for field in fields:

            if field in data:

                updates[field] = data[field]

        updates["updated_at"] = datetime.utcnow()

        mongo.db.users.update_one(

            {

                "_id": employee["_id"]

            },

            {

                "$set": updates

            }

        )

        return success(

            "Employee Updated"

        )
    @staticmethod
    def delete_employee(employee_id):

        try:

            employee = mongo.db.users.find_one(
                {
                    "_id": ObjectId(employee_id)
                }
            )

        except Exception:

            return error(
                "Invalid Employee ID",
                400
            )

        if employee is None:

            return error(
                "Employee not found",
                404
            )

        mongo.db.users.delete_one(
            {
                "_id": employee["_id"]
            }
        )

        return success(
            "Employee Deleted Successfully"
        )


    @staticmethod
    def search_employee(keyword):

        cursor = mongo.db.users.find(
            {
                "$or": [

                    {
                        "employee_name": {
                            "$regex": keyword,
                            "$options": "i"
                        }
                    },

                    {
                        "email": {
                            "$regex": keyword,
                            "$options": "i"
                        }
                    },

                    {
                        "department": {
                            "$regex": keyword,
                            "$options": "i"
                        }
                    },

                    {
                        "designation": {
                            "$regex": keyword,
                            "$options": "i"
                        }
                    }

                ]
            },
            {
                "password": 0
            }
        )

        employees = []

        for employee in cursor:

            employee["_id"] = str(employee["_id"])

            employees.append(employee)

        return success(
            "Employees Found",
            employees
        )


    @staticmethod
    def get_department_employees(department):

        cursor = mongo.db.users.find(
            {
                "department": department
            },
            {
                "password": 0
            }
        )

        employees = []

        for employee in cursor:

            employee["_id"] = str(employee["_id"])

            employees.append(employee)

        return success(
            "Department Employees",
            employees
        )


    @staticmethod
    def toggle_employee_status(employee_id):

        try:

            employee = mongo.db.users.find_one(
                {
                    "_id": ObjectId(employee_id)
                }
            )

        except Exception:

            return error(
                "Invalid Employee ID",
                400
            )

        if employee is None:

            return error(
                "Employee not found",
                404
            )

        new_status = not employee.get(
            "is_active",
            True
        )

        mongo.db.users.update_one(

            {
                "_id": employee["_id"]
            },

            {
                "$set": {

                    "is_active": new_status,

                    "updated_at": datetime.utcnow()

                }
            }

        )

        return success(
            "Employee Status Updated",
            {
                "is_active": new_status
            }
        )


    @staticmethod
    def update_profile_picture(employee_id, picture):

        try:

            employee = mongo.db.users.find_one(
                {
                    "_id": ObjectId(employee_id)
                }
            )

        except Exception:

            return error(
                "Invalid Employee ID",
                400
            )

        if employee is None:

            return error(
                "Employee not found",
                404
            )

        filename = upload_profile_picture(
            picture
        )

        mongo.db.users.update_one(

            {
                "_id": employee["_id"]
            },

            {
                "$set": {

                    "profile_picture": filename,

                    "updated_at": datetime.utcnow()

                }
            }

        )

        return success(

            "Profile Picture Updated",

            {
                "profile_picture": filename
            }

        )


    @staticmethod
    def get_profile(login_id):

        employee = mongo.db.users.find_one(
            {
                "login_id": login_id
            },
            {
                "password": 0
            }
        )

        if employee is None:

            return error(
                "Employee not found",
                404
            )

        employee["_id"] = str(employee["_id"])

        return success(
            "Profile Retrieved",
            employee
        )