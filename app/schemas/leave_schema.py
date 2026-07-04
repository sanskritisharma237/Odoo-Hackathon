from marshmallow import Schema
from marshmallow import fields


class LeaveApplicationSchema(Schema):

    leave_type = fields.String(required=True)

    start_date = fields.Date(required=True)

    end_date = fields.Date(required=True)

    reason = fields.String(required=True)


class LeaveApprovalSchema(Schema):

    status = fields.String(required=True)

    remarks = fields.String(required=False)


class LeaveFilterSchema(Schema):

    status = fields.String(required=False)

    leave_type = fields.String(required=False)

    employee = fields.String(required=False)