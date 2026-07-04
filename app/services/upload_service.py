import os

from werkzeug.utils import secure_filename


UPLOAD_FOLDER="app/uploads/profile_pictures"


def upload_profile_picture(file):

    if file is None:

        return "default.png"

    filename=secure_filename(file.filename)

    file.save(

        os.path.join(

            UPLOAD_FOLDER,

            filename

        )

    )

    return filename