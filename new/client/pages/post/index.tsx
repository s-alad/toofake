import { useState } from "react";

import s from './post.module.scss'
import axios from "axios";

export default function Post() {

    const [loading, setLoading] = useState(false);

    const [valid, setValid] = useState(true);
    const [validContent, setValidContent] = useState('');

    const [publicpost, setPublic] = useState(false);

    const [posting, setPosting] = useState(false);
    const [postContent, setPostContent] = useState('');

    const [caption, setCaption] = useState('');
    const [selectedFileOne, setSelectedFileOne]: any = useState();
    const [selectedFileTwo, setSelectedFileTwo]: any = useState();
    const [isFirstFilePicked, setIsFirstFilePicked] = useState(false);
    const [isSecondFilePicked, setIsSecondFilePicked] = useState(false);

    const [primarybase64, setPrimaryBase64] = useState<any>('');
    const [secondarybase64, setSecondaryBase64] = useState('');

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

    function getBase64(file: any) {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL: any = "";
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };

    let reader = new FileReader();
    function handleSubmission() {

        console.log("BASE64");
        console.log(primarybase64);
        console.log(secondarybase64);

        let authorization_token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append('primary', selectedFileOne);
        formData.append('secondary', selectedFileTwo);
        /* formData.append('primary', primarybase64);
        formData.append('secondary', secondarybase64); */
        formData.append('caption', caption);
        formData.append('token', authorization_token!);
        console.log(formData);

        let options = {
            url: "/api/post",
            method: "POST",
            headers: { 'Content-Type': "multipart/form-data" },
            data: formData,
        }

        axios.request(options).then(
            (response) => {
                console.log(response.data);
            }
        ).catch(
            (error) => {
                console.log(error);
            }
        )
    }

    return (
        <div>
            <div className={s.images}>
                <div className={`${s.img} ${s.one}`}>
                    <label htmlFor="file-one-upload" className={s.upload}>Choose Front image</label>
                    <input id="file-one-upload" type="file" name="file" onChange={fileOneHandler} />
                    {isFirstFilePicked ? (
                        <div className={s.sub}>
                            <img src={URL.createObjectURL(selectedFileOne)} />
                        </div>
                    ) : (
                        <>
                        </>
                    )}
                </div>
                <div className={`${s.img} ${s.two}`}>
                    <label htmlFor="file-two-upload" className={s.upload}>Choose Back image</label>
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
            <input className={s.caption} placeholder='your caption' onChange={(txt) => setCaption(txt.target.value)}></input>
            <div className={s.submit} onClick={() => { handleSubmission() }}>
                submit
            </div>
        </div>
    )
}