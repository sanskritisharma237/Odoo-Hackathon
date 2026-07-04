from marshmallow import Schema
from marshmallow import fields


class PayrollSchema(Schema):

    basic_salary = fields.Float(required=True)

    hra = fields.Float(required=True)

    special_allowance = fields.Float(required=True)

    bonus = fields.Float(required=False)

    deductions = fields.Float(required=False)

    professional_tax = fields.Float(required=False)

    provident_fund = fields.Float(required=False)


class PayrollFilterSchema(Schema):

    month = fields.Integer(required=True)

    year = fields.Integer(required=True)