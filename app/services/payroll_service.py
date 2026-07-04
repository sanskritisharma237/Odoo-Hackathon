from datetime import datetime

from bson import ObjectId

from app.extensions import mongo

from app.utils.response import success
from app.utils.response import error


class PayrollService:
    @staticmethod
    def create_payroll(login_id, data):

        employee = mongo.db.users.find_one(

            {

                "login_id": login_id

            }

        )

        if employee is None:

            return error(

                "Employee Not Found",

                404

            )

        gross_salary = (

            data["basic_salary"]

            + data["hra"]

            + data["special_allowance"]

            + data.get("bonus", 0)

        )

        total_deductions = (

            data.get("professional_tax", 0)

            + data.get("provident_fund", 0)

            + data.get("deductions", 0)

        )

        net_salary = gross_salary - total_deductions

        payroll = {

            "login_id": login_id,

            "employee_name": employee["employee_name"],

            "department": employee["department"],

            "designation": employee["designation"],

            "month": datetime.now().month,

            "year": datetime.now().year,

            "basic_salary": data["basic_salary"],

            "hra": data["hra"],

            "special_allowance": data["special_allowance"],

            "bonus": data.get(

                "bonus",

                0

            ),

            "professional_tax": data.get(

                "professional_tax",

                0

            ),

            "provident_fund": data.get(

                "provident_fund",

                0

            ),

            "other_deductions": data.get(

                "deductions",

                0

            ),

            "gross_salary": gross_salary,

            "net_salary": net_salary,

            "created_at": datetime.utcnow(),

            "updated_at": datetime.utcnow()

        }

        mongo.db.payroll.insert_one(

            payroll

        )

        return success(

            "Payroll Created",

            payroll,

            201

        )
    @staticmethod
    def current_salary(login_id):

        payroll = mongo.db.payroll.find_one(

            {

                "login_id": login_id

            },

            sort=[

                (

                    "created_at",

                    -1

                )

            ]

        )

        if payroll is None:

            return error(

                "Payroll Not Found",

                404

            )

        payroll["_id"] = str(

            payroll["_id"]

        )

        return success(

            "Current Salary",

            payroll

        )
    @staticmethod
    def salary_history(login_id):

        cursor = mongo.db.payroll.find(

            {

                "login_id": login_id

            }

        ).sort(

            "created_at",

            -1

        )

        salaries = []

        for payroll in cursor:

            payroll["_id"] = str(

                payroll["_id"]

            )

            salaries.append(

                payroll

            )

        return success(

            "Salary History",

            salaries

        )
    @staticmethod
    def get_payroll(payroll_id):

        try:

            payroll = mongo.db.payroll.find_one(

                {

                    "_id": ObjectId(

                        payroll_id

                    )

                }

            )

        except Exception:

            return error(

                "Invalid Payroll ID",

                400

            )

        if payroll is None:

            return error(

                "Payroll Not Found",

                404

            )

        payroll["_id"] = str(

            payroll["_id"]

        )

        return success(

            "Payroll Details",

            payroll

        )
    @staticmethod
    def update_payroll(payroll_id, data):

        try:

            payroll = mongo.db.payroll.find_one(
                {
                    "_id": ObjectId(payroll_id)
                }
            )

        except Exception:

            return error(
                "Invalid Payroll ID",
                400
            )

        if payroll is None:

            return error(
                "Payroll Record Not Found",
                404
            )

        updates = {}

        fields = [

            "basic_salary",

            "hra",

            "special_allowance",

            "bonus",

            "professional_tax",

            "provident_fund",

            "other_deductions"

        ]

        for field in fields:

            if field in data:

                updates[field] = data[field]

        basic = updates.get(
            "basic_salary",
            payroll["basic_salary"]
        )

        hra = updates.get(
            "hra",
            payroll["hra"]
        )

        allowance = updates.get(
            "special_allowance",
            payroll["special_allowance"]
        )

        bonus = updates.get(
            "bonus",
            payroll["bonus"]
        )

        pf = updates.get(
            "provident_fund",
            payroll["provident_fund"]
        )

        tax = updates.get(
            "professional_tax",
            payroll["professional_tax"]
        )

        deductions = updates.get(
            "other_deductions",
            payroll["other_deductions"]
        )

        gross = basic + hra + allowance + bonus

        net = gross - (pf + tax + deductions)

        updates["gross_salary"] = gross

        updates["net_salary"] = net

        updates["updated_at"] = datetime.utcnow()

        mongo.db.payroll.update_one(

            {

                "_id": payroll["_id"]

            },

            {

                "$set": updates

            }

        )

        return success(

            "Payroll Updated Successfully"

        )


    @staticmethod
    def delete_payroll(payroll_id):

        try:

            payroll = mongo.db.payroll.find_one(

                {

                    "_id": ObjectId(payroll_id)

                }

            )

        except Exception:

            return error(

                "Invalid Payroll ID",

                400

            )

        if payroll is None:

            return error(

                "Payroll Record Not Found",

                404

            )

        mongo.db.payroll.delete_one(

            {

                "_id": payroll["_id"]

            }

        )

        return success(

            "Payroll Deleted Successfully"

        )


    @staticmethod
    def monthly_payroll(month, year):

        cursor = mongo.db.payroll.find(

            {

                "month": month,

                "year": year

            }

        )

        payrolls = []

        total_salary = 0

        for payroll in cursor:

            payroll["_id"] = str(payroll["_id"])

            total_salary += payroll["net_salary"]

            payrolls.append(payroll)

        return success(

            "Monthly Payroll",

            {

                "records": payrolls,

                "total_salary_paid": total_salary

            }

        )


    @staticmethod
    def payroll_statistics():

        cursor = mongo.db.payroll.find()

        employees = 0

        total_salary = 0

        highest = 0

        lowest = None

        for payroll in cursor:

            employees += 1

            salary = payroll["net_salary"]

            total_salary += salary

            if salary > highest:

                highest = salary

            if lowest is None or salary < lowest:

                lowest = salary

        average = 0

        if employees > 0:

            average = round(

                total_salary / employees,

                2

            )

        return success(

            "Payroll Statistics",

            {

                "employees": employees,

                "total_salary_paid": total_salary,

                "highest_salary": highest,

                "lowest_salary": lowest,

                "average_salary": average

            }

        )


    @staticmethod
    def employee_report(login_id):

        cursor = mongo.db.payroll.find(

            {

                "login_id": login_id

            }

        ).sort(

            "created_at",

            -1

        )

        report = []

        for payroll in cursor:

            payroll["_id"] = str(

                payroll["_id"]

            )

            report.append(

                payroll

            )

        return success(

            "Employee Payroll Report",

            report

        )


    @staticmethod
    def generate_payslip(payroll_id):

        try:

            payroll = mongo.db.payroll.find_one(

                {

                    "_id": ObjectId(

                        payroll_id

                    )

                }

            )

        except Exception:

            return error(

                "Invalid Payroll ID",

                400

            )

        if payroll is None:

            return error(

                "Payroll Record Not Found",

                404

            )

        payroll["_id"] = str(

            payroll["_id"]

        )

        payslip = {

            "employee": payroll["employee_name"],

            "designation": payroll["designation"],

            "department": payroll["department"],

            "month": payroll["month"],

            "year": payroll["year"],

            "gross_salary": payroll["gross_salary"],

            "deductions": payroll["professional_tax"]
            + payroll["provident_fund"]
            + payroll["other_deductions"],

            "net_salary": payroll["net_salary"]

        }

        return success(

            "Payslip Generated",

            payslip

        )