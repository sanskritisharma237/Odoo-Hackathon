from datetime import datetime

from flask_jwt_extended import create_access_token

from app.extensions import mongo
from app.extensions import bcrypt

from app.utils.response import success, error

from app.services.password_generator import generate_password
from app.services.login_id_generator import generate_login_id
from app.services.upload_service import upload_profile_picture


class AuthService:

    @staticmethod
    def register_employee(data, file):

        existing_email = mongo.db.users.find_one(
            {
                "email": data["email"]
            }
        )

        if existing_email:
            return error(
                "Email already exists",
                409
            )

        company = mongo.db.company.find_one()

        if company is None:
            return error(
                "Company has not been configured",
                400
            )

        temporary_password = generate_password()

        hashed_password = bcrypt.generate_password_hash(
            temporary_password
        ).decode("utf-8")

        profile_picture = upload_profile_picture(file)

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

            "profile_picture": profile_picture,

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
    def login(data):

        user = mongo.db.users.find_one(

            {

                "login_id": data["login_id"]

            }

        )

        if user is None:

            return error(

                "Invalid Login ID",

                401

            )

        if not user["is_active"]:

            return error(

                "Account Disabled",

                403

            )

        if not bcrypt.check_password_hash(

                user["password"],

                data["password"]

        ):

            return error(

                "Incorrect Password",

                401

            )

        access_token = create_access_token(

            identity=user["login_id"],

            additional_claims={

                "role": user["role"]

            }

        )

        return success(

            "Login Successful",

            {

                "token": access_token,

                "login_id": user["login_id"],

                "employee_name": user["employee_name"],

                "role": user["role"],

                "first_login": user["first_login"]

            }

        )    @staticmethod
    def change_password(user, data):

        current_password = data.get("current_password")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        if not current_password or not new_password or not confirm_password:
            return error(
                "All password fields are required",
                400
            )

        if not bcrypt.check_password_hash(
            user["password"],
            current_password
        ):
            return error(
                "Current password is incorrect",
                401
            )

        if new_password != confirm_password:
            return error(
                "Passwords do not match",
                400
            )

        if len(new_password) < 8:
            return error(
                "Password must be at least 8 characters long",
                400
            )

        hashed_password = bcrypt.generate_password_hash(
            new_password
        ).decode("utf-8")

        mongo.db.users.update_one(
            {
                "_id": user["_id"]
            },
            {
                "$set": {
                    "password": hashed_password,
                    "first_login": False,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        return success(
            "Password updated successfully"
        )

    @staticmethod
    def current_user(user):

        profile = {

            "login_id": user["login_id"],

            "employee_name": user["employee_name"],

            "email": user["email"],

            "phone": user["phone"],

            "department": user["department"],

            "designation": user["designation"],

            "role": user["role"],

            "profile_picture": user["profile_picture"],

            "first_login": user["first_login"]

        }

        return success(
            "Profile fetched successfully",
            profile
        )

    @staticmethod
    def logout():

        """
        JWT logout is handled on the frontend by
        deleting the stored token.

        If you later implement token blacklisting,
        this method can be extended.
        """

        return success(
            "Logged out successfully"
        )

    @staticmethod
    def forgot_password(data):

        login_id = data.get("login_id")

        if not login_id:
            return error(
                "Login ID is required",
                400
            )

        user = mongo.db.users.find_one(
            {
                "login_id": login_id
            }
        )

        if not user:
            return error(
                "User not found",
                404
            )

        temporary_password = generate_password()

        hashed_password = bcrypt.generate_password_hash(
            temporary_password
        ).decode("utf-8")

        mongo.db.users.update_one(
            {
                "_id": user["_id"]
            },
            {
                "$set": {
                    "password": hashed_password,
                    "first_login": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        return success(

            "Temporary password generated",

            {
                "login_id": login_id,
                "temporary_password": temporary_password
            }

        )

    @staticmethod
    def reset_password(login_id, new_password):

        user = mongo.db.users.find_one(
            {
                "login_id": login_id
            }
        )

        if user is None:
            return error(
                "User not found",
                404
            )

        hashed_password = bcrypt.generate_password_hash(
            new_password
        ).decode("utf-8")

        mongo.db.users.update_one(
            {
                "_id": user["_id"]
            },
            {
                "$set": {
                    "password": hashed_password,
                    "first_login": False,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        return success(
            "Password reset successfully"
        )