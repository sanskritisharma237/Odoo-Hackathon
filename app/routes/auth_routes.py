from flask import Blueprint
from flask import request

from app.services.auth_service import AuthService

from app.middleware.auth_required import auth_required


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register_employee():

    data = request.form.to_dict()

    profile_picture = request.files.get("profile_picture")

    return AuthService.register_employee(
        data,
        profile_picture
    )


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if data is None:
        return {
            "success": False,
            "message": "Request body is required"
        }, 400

    return AuthService.login(data)


@auth_bp.route("/me", methods=["GET"])
@auth_required
def current_user():

    return AuthService.current_user(
        request.user
    )


@auth_bp.route("/change-password", methods=["PUT"])
@auth_required
def change_password():

    data = request.get_json()

    return AuthService.change_password(
        request.user,
        data
    )


@auth_bp.route("/logout", methods=["POST"])
@auth_required
def logout():

    return AuthService.logout()


@auth_bp.route("/reset-password", methods=["PUT"])
@auth_required
def reset_password():

    if request.user["role"] != "Admin":
        return {
            "success": False,
            "message": "Only Admin can reset passwords"
        }, 403

    data = request.get_json()

    login_id = data.get("login_id")
    new_password = data.get("new_password")

    return AuthService.reset_password(
        login_id,
        new_password
    )