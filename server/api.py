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
    "x-firebase-client": "apple-platform/ios apple-sdk/19F64 appstore/true deploy/cocoapods device/iPhone9,1 fire-abt/8.15.0 fire-analytics/8.15.0 fire-auth/8.15.0 fire-db/8.15.0 fire-dl/8.15.0 fire-fcm/8.15.0 fire-fiam/8.15.0 fire-fst/8.15.0 fire-fun/8.15.0 fire-install/8.15.0 fire-ios/8.15.0 fire-perf/8.15.0 fire-rc/8.15.0 fire-str/8.15.0 firebase-crashlytics/8.15.0 os-version/14.7.1 xcode/13F100",
    "user-agent":"FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1",
    "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
    "x-firebase-client-log-type": "0",
    "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
}

@app.route("/")
def slash():
    return "<p>/</p>"

@app.route("/sendotp/<phone>")
def send_otp(phone: str):
    print(phone)
    res = requests.post(
        url="https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode",
        params={"key":google_api_key},
        data={
                "phoneNumber": phone,
                "iosReceipt": "AEFDNu9QZBdycrEZ8bM_2-Ei5kn6XNrxHplCLx2HYOoJAWx-uSYzMldf66-gI1vOzqxfuT4uJeMXdreGJP5V1pNen_IKJVED3EdKl0ldUyYJflW5rDVjaQiXpN0Zu2BNc1c",
                "iosSecret": "KKwuB8YqwuM3ku0z",
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

    