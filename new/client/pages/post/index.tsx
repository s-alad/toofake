import { useState } from "react";

import s from './post.module.scss'
import axios from "axios";

export default function Post() {

    let [loading, setLoading] = useState<boolean>(false);
    let [failure, setFailure] = useState<string>("");

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

            // on reader load somthing...
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

        console.log("BASE64");
        console.log(primarybase64);
        console.log(secondarybase64);

        let authorization_token = localStorage.getItem("token");

        const formData = new FormData();
        /* formData.append('primary', selectedFileOne);
        formData.append('secondary', selectedFileTwo); */
        formData.append('primaryb64', primarybase64);
        formData.append('secondaryb64', secondarybase64);
        formData.append('caption', caption ? caption : "");
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
                setLoading(false);
            }
        ).catch(
            (error) => {
                console.log(error);
                setLoading(false);
                setFailure(error.response.data.error)
                setTimeout(() => { setFailure("") }, 3000);
            }
        )
    }

    return (
        <div>
            <div className={s.images}>
                <div className={`${s.img}`}>
                    <label htmlFor="file-one-upload" className={s.upload}>Choose Front image</label>
                    <input id="file-one-upload" type="file" name="file" onChange={fileOneHandler} />
                    {isFirstFilePicked ? (
                        <div className={s.sub}>
                            <img src={URL.createObjectURL(selectedFileOne)} />
                        </div>
                    ) : (<></>)}
                </div>
                <div className={`${s.img}`}>
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
                    ) : ""
                )
            }
        </div>
    )
}