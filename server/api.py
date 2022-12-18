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
    print('token', token)
    res = requests.get(
        url=api_url+'/feeds/friends',
        headers={"authorization": token},
    ).json()
    print(res)
    ret = Parse.instant(res)
    print(ret)
    return json.dumps(ret)

#/<caption>/<location>/<primary>/<secondary>
#, caption: str, location: str, primary: str, secondary: str
@app.route("/post/<token>")
def post(token: str):
    json_data = {
        "isPublic": False,
        "caption": 'test',
        "takenAt": 1610000000,
        "isLate": False,
        "location": { 'latitude': "37.2297175", 'longitude': "-115.7911082" },
        "retakeCounter": 0,
        "backCamera": {
            "bucket": "storage.bere.al",
            "height": 2000,
            "width": 1500,
            "path": 'https://www.tutlane.com/images/python/python_string_replace_method.png',
        },
        "frontCamera": {
            "bucket": "storage.bere.al",
            "height": 2000,
            "width": 1500,
            "path": 'https://www.tutlane.com/images/python/python_string_replace_method.png',
        },
    }
    res = requests.post(
        url=api_url+'/content/post',
        json=json_data,
        headers={"authorization": token},
    )
    print(res)
    print(res.json())
    return res.json()

if __name__ == '__main__':
    #app.run(port=5100, debug=True)
    app.run(debug=True, port=os.getenv("PORT", default=5100))
    print('online')

    