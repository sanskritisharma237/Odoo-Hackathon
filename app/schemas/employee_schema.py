from marshmallow import Schema, fields

class EmployeeSchema(Schema):

    employee_name = fields.String(required=True)

    email = fields.Email(required=True)

    phone = fields.String(required=True)

    department = fields.String(required=True)

    designation = fields.String(required=True)