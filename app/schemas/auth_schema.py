from marshmallow import Schema

from marshmallow import fields


from marshmallow import Schema, fields

class RegisterSchema(Schema):

    employee_name = fields.String(required=True)

    email = fields.Email(required=True)

    phone = fields.String(required=True)

    department = fields.String(required=True)

    designation = fields.String(required=True)

class LoginSchema(Schema):

    email=fields.Email(required=True)

    password=fields.String(required=True)