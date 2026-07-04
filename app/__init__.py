from flask import Flask

from config import Config

from app.extensions import mongo
from app.extensions import bcrypt
from app.extensions import jwt

from app.routes.auth_routes import auth_bp
from app.routes.employee_routes import employee_bp
from app.routes.attendance_routes import attendance_bp
from app.routes.leave_routes import leave_bp
from app.routes.payroll_routes import payroll_bp
from app.routes.dashboard_routes import dashboard_bp
from app.routes.admin_routes import admin_bp


def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    mongo.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(leave_bp)
    app.register_blueprint(payroll_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(admin_bp)

    return app