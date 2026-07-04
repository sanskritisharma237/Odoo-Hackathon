from datetime import datetime
from app.extensions import mongo


def generate_login_id(company_short, employee_name):

    words = employee_name.strip().split()

    if len(words) == 1:
        first = words[0][:2]
        last = "XX"
    else:
        first = words[0][:2]
        last = words[-1][:2]

    year = datetime.now().year

    count = mongo.db.users.count_documents(
        {
            "joining_year": year
        }
    ) + 1

    serial = str(count).zfill(4)

    return (
        company_short.upper()
        + first.upper()
        + last.upper()
        + str(year)
        + serial
    )