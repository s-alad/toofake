import json
import requests
import os
from flask import Flask

import models.instant
from parse import Parse

app = Flask(__name__)

api_url="https://mobile.bereal.com/api"
google_api_key="AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA"

head = {
    "user-agent": "AlexisBarreyat.BeReal/0.24.0 iPhone/16.0.2 hw/iPhone12_8 (GTMSUF/1)",
    "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
}

@app.route("/")
def slash():
    return "<p>/</p>"

@app.route("/sendotp/<phone>")
def send_otp(phone: str):
    res = requests.post(
        url="https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode",
        params={"key":google_api_key},
        data={
                "phoneNumber": phone,
                "iosReceipt": "AEFDNu9QZBdycrEZ8bM_2-Ei5kn6XNrxHplCLx2HYOoJAWx-uSYzMldf66-gI1vOzqxfuT4uJeMXdreGJP5V1pNen_IKJVED3EdKl0ldUyYJflW5rDVjaQiXpN0Zu2BNc1c",
            },
        headers=head
    ).json()
    print(res)
    return res

@app.route("/verifyotp/<otp>/<session>")
def verify_otp(otp: str, session: str):
    if session is None:
        raise Exception("No open otp session.")
    res = requests.post(
        url="https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber",
        params={"key": google_api_key},
        data={
            "sessionInfo": session,
            "code": otp,
            "operation": "SIGN_UP_OR_IN",
        },
    ).json()
    print(res)
    return res

@app.route("/refresh/<token>")
def refresh(token: str):
    res = requests.post(
        url="https://securetoken.googleapis.com/v1/token",
        params={"key": google_api_key},
        data={
            "refresh_token": token,
            "grant_type": "refresh_token"
        }
    ).json()
    print(res)
    return res

@app.route("/instants/<token>")
def instants(token: str):
    res = requests.get(
        url=api_url+'/feeds/friends',
        headers={"authorization": token},
    ).json()
    print(res)
    ret = Parse.instant(res)
    print(ret)
    return json.dumps(ret)

def post():
    json_data = {
        "isPublic": is_public,
        "isLate": is_late,
        "retakeCounter": retakes,
        "takenAt": taken_at,
        "location": location,
        "caption": caption,
        "backCamera": {
            "bucket": "storage.bere.al",
            "height": primary_picture.height,
            "width": primary_picture.width,
            "path": primary_picture.url.replace("https://storage.bere.al/", ""),
        },
        "frontCamera": {
            "bucket": "storage.bere.al",
            "height": secondary_picture.height,
            "width": secondary_picture.width,
            "path": secondary_picture.url.replace("https://storage.bere.al/", ""),
        },
    }


if __name__ == '__main__':
    #app.run(port=5100, debug=True)
    app.run(debug=True, port=os.getenv("PORT", default=5100))
    print('online')

    