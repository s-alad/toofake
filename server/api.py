import json
import uuid
import requests
import os
import io
from flask import Flask, request
import models.instant
from parse import Parse
from urllib.parse import quote_plus
import pendulum
from PIL import Image

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
    return "<p>-</p>"

@app.route("/sendotp/<phone>")
def send_otp(phone: str):
    print("=========================================")
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
    print('----- SENT OTP -----')
    print(res)
    print('----- END -----')
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
    print("----- VERIFIED OTP -----")
    print(res)
    print('----- END -----')
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
    print("----- REFRESHED -----")
    #print(res)
    print('----- END -----')
    return res

@app.route("/instants/<token>")
def instants(token: str):
    #print('token', token)
    res = requests.get(
        url=api_url+'/feeds/friends',
        headers={"authorization": token},
    )
    if res.status_code != 200:
        print("instant fetch error", res.json())
        return res.json()
    res = res.json()
    print("----- INSTANTS -----")
    #print(res)
    #print("<>")
    ret = Parse.instant(res)
    #print(ret)
    print('----- END -----')
    return json.dumps(ret)

@app.route("/postinstant/<token>/<uid>/", methods=["POST"])
@app.route("/postinstant/<token>/<uid>/<caption>", methods=["POST"])
def postinstant(token:str, uid:str, caption:str=''):
    print('CAPTION:', caption)
    def get_data(version):  
        version_data = io.BytesIO()
        version.save(version_data, format="JPEG", quality=90)
        version_data = version_data.getvalue()
        return version_data
    
    def extension(img):
        mime_type = Image.MIME[img.format]
        if mime_type != "image/jpeg":
            if not img.mode == "RGB":
                img = img.convert("RGB")
        return img

    p = request.files['primary'] 
    primary = Image.open(io.BytesIO(p.read()))
    primary = extension(primary)
    prim_data = get_data(primary)
    primarysize = str(len(prim_data))

    s = request.files['secondary']
    secondary = Image.open(io.BytesIO(s.read()))
    secondary = extension(secondary)
    sec_data = get_data(secondary)
    secondarysize = str(len(sec_data))

    def upload(file_data, size, alt: bool):
        name = f"Photos/{uid}/bereal/{uuid.uuid4()}-{int(pendulum.now().timestamp())}{'-secondary' if alt else ''}.jpg"
        print(name)

        json_data = {"cacheControl": "public,max-age=172800","contentType": "image/webp","metadata": {"type": "bereal"},"name": name}
        headers = {
            "x-goog-upload-protocol": "resumable","x-goog-upload-command": "start","x-firebase-storage-version": "ios/9.4.0",
            "x-goog-upload-content-type": "image/webp","content-type": "application/json","x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
            "Authorization": f"Firebase {token}",
            "x-goog-upload-content-length": size,
        }
        params = {"uploadType": "resumable","name": name}

        uri = f"https://firebasestorage.googleapis.com/v0/b/storage.bere.al/o/{quote_plus(name)}"
        print("URI: ", uri)
        init_res = requests.post(uri, headers=headers, params=params, data=json.dumps(json_data))
        print("INITIAL RESULT: ", init_res)
        if init_res.status_code != 200: raise Exception(f"Error initiating upload: {init_res.status_code}")
        upload_url = init_res.headers["x-goog-upload-url"]
        upheaders = {"x-goog-upload-command": "upload, finalize","x-goog-upload-protocol": "resumable",
        "x-goog-upload-offset": "0","content-type": "image/jpeg",}
        # upload the image
        print("UPLOAD URL", upload_url)
        upload_res = requests.put(url=upload_url, headers=upheaders, data=file_data)
        if upload_res.status_code != 200: raise Exception(f"Error uploading image: {upload_res.status_code}, {upload_res.text}")
        res_data = upload_res.json()
        return res_data
    
    primary_res = upload(prim_data, primarysize, False)
    secondary_res = upload(sec_data, secondarysize, True)

    print(primary_res)
    print(secondary_res)

    primary_ret_name = primary_res['name']
    secondary_ret_name = secondary_res['name']
    primary_bucket = primary_res['bucket']
    secondary_bucket = secondary_res['bucket']
    primary_url = f"https://{primary_bucket}/{primary_ret_name}"
    secondary_url = f"https://{secondary_bucket}/{secondary_ret_name}"

    now = pendulum.now()
    taken_at = f"{now.to_date_string()}T{now.to_time_string()}Z"

    payload = {
        "isPublic": False,
        "isLate": False,
        "retakeCounter": 0,
        "takenAt": taken_at,
        #"location": location,
        "caption": caption,
        "backCamera": {
            "bucket": "storage.bere.al",
            "height": 2000,
            "width": 1500,
            "path": primary_url.replace("https://storage.bere.al/", ""),
        },
        "frontCamera": {
            "bucket": "storage.bere.al",
            "height": 2000,
            "width": 1500,
            "path": secondary_url.replace("https://storage.bere.al/", ""),
        },
    }
    complete_res = requests.post(url=api_url+'/content/post',json=payload,headers={"authorization": token},)
    print(complete_res)
    print(complete_res.json())

    return complete_res.json()

@app.route("/me/<token>")
def me(token: str):
    res = requests.get(
        url=api_url+'/person/me',
        headers={"authorization": token},
    ).json()
    print("----- ME -----")
    print(res)
    print('----- END -----')
    return Parse.me(res)

@app.route("/comment/<postid>/<comment>/<token>")
def comment(postid: str, comment: str, token: str):
    print(postid)
    res = requests.post(
        url=api_url+'/content/comments',
        data={"content":comment}, 
        params={"postId":postid}, 
        headers={"authorization": token}
    ).json()
    print("----- COMMENT -----")
    print(res)
    print('----- END -----')
    return res

if __name__ == '__main__':
    #app.run(port=5100, debug=True)
    app.run(debug=True, port=os.getenv("PORT", default=5100))
    print('online')