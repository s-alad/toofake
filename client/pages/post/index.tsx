import { useState } from "react";

import s from './post.module.scss'
import axios from "axios";
import useCheck from "@/utils/check";
import { useRouter } from "next/router";

export default function Post() {

    useCheck();

    let router = useRouter();

    let [loading, setLoading] = useState<boolean>(false);
    let [failure, setFailure] = useState<string>("");
    let [success, setSuccess] = useState<string>("");

    const [caption, setCaption] = useState('');
    const [selectedFileOne, setSelectedFileOne]: any = useState();
    const [selectedFileTwo, setSelectedFileTwo]: any = useState();
    const [isFirstFilePicked, setIsFirstFilePicked] = useState(false);
    const [isSecondFilePicked, setIsSecondFilePicked] = useState(false);

    const [primarybase64, setPrimaryBase64] = useState<any>('');
    const [secondarybase64, setSecondaryBase64] = useState('');

    function getBase64(file: any) {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL: any = "";
            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };

    function fileOneHandler(event: any) {
        setIsFirstFilePicked(true);
        setSelectedFileOne(event.target.files[0]);

        getBase64(event.target.files[0]).then(result => {
            setPrimaryBase64(result!.toString());
        }).catch(err => {
            console.log(err);
        });
    };

    function fileTwoHandler(event: any) {
        setIsSecondFilePicked(true);
        setSelectedFileTwo(event.target.files[0]);

        getBase64(event.target.files[0]).then(result => {
            setSecondaryBase64(result!.toString());
        }).catch(err => {
            console.log(err);
        });
    };

    function handleSubmission() {

        setLoading(true);

        /* console.log("BASE64");
        console.log(primarybase64);
        console.log(secondarybase64); */

        let authorization_token = localStorage.getItem("token");

        const formData = new FormData();
        /* formData.append('primary', selectedFileOne);
        formData.append('secondary', selectedFileTwo); */
        formData.append('primaryb64', primarybase64);
        formData.append('secondaryb64', secondarybase64);
        formData.append('caption', caption ? caption : "");
        formData.append('token', authorization_token!);
        /* console.log(formData); */

        let options = {
            url: "/api/add/post",
            method: "POST",
            headers: { 'Content-Type': "multipart/form-data" },
            data: formData,
        }

        axios.request(options).then(
            (response) => {
                console.log(response.data);
                setLoading(false);
                setSuccess("Successfully posted!");
                setTimeout(() => { setSuccess(""); router.push("/feed")}, 3000);
            }
        ).catch(
            (error) => {
                console.log(error);
                setLoading(false);
                setFailure(error.response.data.error)
                setTimeout(() => { setFailure("") }, 5000);
            }
        )
    }

    return (
        <div>
            <div className={s.images}>
                <div className={`${s.img}`}>
                    <label htmlFor="file-one-upload" className={s.upload}>Choose Back image</label>
                    <input id="file-one-upload" type="file" name="file" onChange={fileOneHandler} />
                    {isFirstFilePicked ? (
                        <div className={s.sub}>
                            <img src={URL.createObjectURL(selectedFileOne)} />
                        </div>
                    ) : (<></>)}
                </div>
                <div className={`${s.img}`}>
                    <label htmlFor="file-two-upload" className={s.upload}>Choose Front image</label>
                    <input id="file-two-upload" type="file" name="file" onChange={fileTwoHandler} />
                    {isSecondFilePicked ? (
                        <>
                            <div className={s.sub}>
                                <img src={URL.createObjectURL(selectedFileTwo)} />
                            </div>
                        </>
                    ) : (<></>)
                    }
                </div>
            </div>
            <input className={s.caption} placeholder='captions not working, set them after you post in your app!' onChange={(txt) => setCaption(txt.target.value)}
                disabled 
            ></input>
            <div className={s.submit} onClick={() => { handleSubmission() }}>
                submit
            </div>
            <div className={s.info}>
                *some photos taken on an iphone (.heic) may not work. if there is an error try taking a screenshot of the image and uploading that instead.<br />
                *you might get a client-side exception if the image is too large. The maximum limit currently is 4.5mb for both images combined.
            </div>
            {/* fix this nesting */}
            {
                failure != "" ? (
                    <div className={s.failure}>
                        {failure}
                    </div>
                ) : (
                    loading ? (
                        <div className={s.loading}>
                            loading...
                        </div>
                    ) : (
                        success != "" ? (
                            <div className={s.success}>
                                {success}
                            </div>
                        ) : (<></>)
                    )
                )
            }
        </div>
    )
}
