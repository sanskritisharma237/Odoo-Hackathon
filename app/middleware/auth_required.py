from functools import wraps

from flask import request

from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended import get_jwt_identity

from app.extensions import mongo

from app.utils.response import error


def auth_required(function):

    @wraps(function)

    def decorated(*args, **kwargs):

        try:

            verify_jwt_in_request()

            login_id = get_jwt_identity()

            user = mongo.db.users.find_one(

                {

                    "login_id": login_id

                }

            )

            if user is None:

                return error(

                    "Unauthorized",

                    401

                )

            request.user = user

            return function(

                *args,

                **kwargs

            )

        except Exception:

            return error(

                "Invalid or Expired Token",

                401

            )

    return decorated