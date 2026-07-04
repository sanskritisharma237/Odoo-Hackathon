from functools import wraps

from flask import request

from app.middleware.auth_required import auth_required

from app.utils.response import error


def admin_required(function):

    @auth_required

    @wraps(function)

    def decorated(*args, **kwargs):

        if request.user["role"] != "Admin":

            return error(

                "Admin Access Required",

                403

            )

        return function(

            *args,

            **kwargs

        )

    return decorated