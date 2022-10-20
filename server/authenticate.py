import json
import requests

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

""" ses = send_otp("+1")['sessionInfo']
code = str(input('otp >> '))
tok = verify_otp(code, ses)
instants(tok['idToken']) """
""" instants('eyJhbGciOiJSUzI1NiIsImtpZCI6IjVkMzQwZGRiYzNjNWJhY2M0Y2VlMWZiOWQxNmU5ODM3ZWM2MTYzZWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYWxleGlzYmFycmV5YXQtYmVyZWFsIiwiYXVkIjoiYWxleGlzYmFycmV5YXQtYmVyZWFsIiwiYXV0aF90aW1lIjoxNjY2MTUwNzc2LCJ1c2VyX2lkIjoic21idkRWSUdjY09hMFIzbzhQU3RaUXRxeDVEMiIsInN1YiI6InNtYnZEVklHY2NPYTBSM284UFN0WlF0cXg1RDIiLCJpYXQiOjE2NjYxNTA3NzYsImV4cCI6MTY2NjE1NDM3NiwicGhvbmVfbnVtYmVyIjoiKzE5MjkzMzA5MzQxIiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyIrMTkyOTMzMDkzNDEiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwaG9uZSJ9fQ.1Kn3d4nzl9XW_sGSEJ-x-7yc_CrJpZ6BkkFJst9wQkRtTBzi3udFk21auA8_0l-kgYW1y02TVHAernVb8tNOlKfFdSJL1aIdobN4juhQ0-Fzw_ZgEL3s8sNl9Kppc94evjwRsOLfxWlR8mY8RaXFIA-cgbAF33aQRcKB-Mb96E68HUCEUCHTNtvP65e872IAV2N-mj9KWBU2_mTwbhKe9HjDR3lrJnw5YmcIhRdczlGsTmnu3MpQS22vxomhZkplvt_7z1dTNEKafF4GmuDXjYXeONBSTT59BKU5MnhJJlHvyZqYVl3iOjJbvHLkAXYIa41v9Z-ryFPZ40agbYjKKg') """
if __name__ == '__main__':
    app.run(port=5100, debug=True)
    print('online')

    