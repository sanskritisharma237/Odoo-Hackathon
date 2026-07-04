from marshmallow import Schema
from marshmallow import fields


class CheckInSchema(Schema):

    latitude = fields.Float(required=False)

    longitude = fields.Float(required=False)

    remarks = fields.String(required=False)


class CheckOutSchema(Schema):

    remarks = fields.String(required=False)


class AttendanceFilterSchema(Schema):

    month = fields.Integer(required=False)

    year = fields.Integer(required=False)

    employee_id = fields.String(required=False)