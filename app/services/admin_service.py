from datetime import datetime

from bson import ObjectId

from app.extensions import mongo

from app.utils.response import success
from app.utils.response import error

from app.services.password_generator import generate_password
from app.extensions import bcrypt


class AdminService:

    # ---------------------------------------
    # Company
    # ---------------------------------------

    @staticmethod
    def get_company():

        company = mongo.db.company.find_one()

        if company:

            company["_id"] = str(company["_id"])

        return success(
            "Company Details",
            company
        )


    @staticmethod
    def update_company(data):

        company = mongo.db.company.find_one()

        updates = {

            "company_name": data.get("company_name"),

            "company_short": data.get("company_short"),

            "updated_at": datetime.utcnow()

        }

        if company:

            mongo.db.company.update_one(

                {

                    "_id": company["_id"]

                },

                {

                    "$set": updates

                }

            )

        else:

            updates["created_at"] = datetime.utcnow()

            mongo.db.company.insert_one(

                updates

            )

        return success(

            "Company Updated"

        )


    # ---------------------------------------
    # Departments
    # ---------------------------------------

    @staticmethod
    def create_department(data):

        mongo.db.departments.insert_one(

            {

                "department_name": data["department_name"],

                "created_at": datetime.utcnow()

            }

        )

        return success(

            "Department Created"

        )


    @staticmethod
    def get_departments():

        departments = []

        cursor = mongo.db.departments.find()

        for department in cursor:

            department["_id"] = str(

                department["_id"]

            )

            departments.append(

                department

            )

        return success(

            "Departments",

            departments

        )


    @staticmethod
    def delete_department(department_id):

        mongo.db.departments.delete_one(

            {

                "_id": ObjectId(

                    department_id

                )

            }

        )

        return success(

            "Department Deleted"

        )


    # ---------------------------------------
    # Designations
    # ---------------------------------------

    @staticmethod
    def create_designation(data):

        mongo.db.designations.insert_one(

            {

                "designation": data["designation"],

                "created_at": datetime.utcnow()

            }

        )

        return success(

            "Designation Created"

        )


    @staticmethod
    def get_designations():

        designation_list = []

        cursor = mongo.db.designations.find()

        for designation in cursor:

            designation["_id"] = str(

                designation["_id"]

            )

            designation_list.append(

                designation

            )

        return success(

            "Designations",

            designation_list

        )


    @staticmethod
    def delete_designation(designation_id):

        mongo.db.designations.delete_one(

            {

                "_id": ObjectId(

                    designation_id

                )

            }

        )

        return success(

            "Designation Deleted"

        )


    # ---------------------------------------
    # Reset Employee Password
    # ---------------------------------------

    @staticmethod
    def reset_employee_password(login_id):

        employee = mongo.db.users.find_one(

            {

                "login_id": login_id

            }

        )

        if employee is None:

            return error(

                "Employee Not Found",

                404

            )

        temporary_password = generate_password()

        hashed = bcrypt.generate_password_hash(

            temporary_password

        ).decode("utf-8")

        mongo.db.users.update_one(

            {

                "_id": employee["_id"]

            },

            {

                "$set": {

                    "password": hashed,

                    "first_login": True,

                    "updated_at": datetime.utcnow()

                }

            }

        )

        return success(

            "Password Reset Successfully",

            {

                "login_id": login_id,

                "temporary_password": temporary_password

            }

        )