
import s from "./realmoji.module.scss"
import l from "@/styles/loader.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

interface RealmojiProperties {
    emoji: string;
    realmoji: any | undefined;
}

export default function Realmoji({ emoji, realmoji }: RealmojiProperties) {

    let router = useRouter();

    let [loading, setLoading] = useState<boolean>(false);
    let [success, setSuccess] = useState<boolean>(false);
    let [failure, setFailure] = useState<boolean>(false);
    const [selectedFile, setSelectedFile]: any = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [fileBase64, setFileBase64] = useState('');

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

    function fileHandler(event: any) {
        setIsFilePicked(true);
        setSelectedFile(event.target.files[0]);

        getBase64(event.target.files[0]).then(result => {
            setFileBase64(result!.toString());
        }).catch(err => {
            console.log(err);
        });
    };

    function handleSubmission() {

        setLoading(true);

        console.log("BASE64");
        console.log(fileBase64);

        let authorization_token = localStorage.getItem("token");

        fetch("/api/add/realmoji", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authorization_token,
                fileBase64: fileBase64,
                emoji: emoji
            })
        }).then((response) => {
            console.log(response);
            if (response.ok) {
                setLoading(false);
                setSuccess(true);
                setTimeout(() => { setSuccess(false); router.reload()}, 5000);
            } else { throw new Error("Error: " + response.statusText); }
        }).catch((error) => {
            console.log(error);
            setLoading(false);
            setFailure(true)
            setTimeout(() => { setFailure(false) }, 5000);
        })

        /* const formData = new FormData();
        formData.append('fileBase64', fileBase64);
        formData.append('token', authorization_token!);
        formData.append('emoji', emoji);
        console.log(formData);

        let options = {
            url: "/api/add/realmoji",
            method: "POST",
            headers: { 'Content-Type': "multipart/form-data" },
            data: formData,
        }

        axios.request(options).then(
            (response) => {
                console.log(response.data);
                setLoading(false);
                setSuccess(true);
                setTimeout(() => { setSuccess(false); router.reload()}, 5000);
            }
        ).catch(
            (error) => {
                console.log(error);
                setLoading(false);
                setFailure(true)
                setTimeout(() => { setFailure(false) }, 5000);
            }
        ) */
    }

    return (

        <div className={s.realmoji} key={emoji}>

            {
                (realmoji[emoji] != undefined)
                ?
                    (
                        isFilePicked ? 
                        <img src={URL.createObjectURL(selectedFile)} className={s.emoji} /> 
                        : 
                        <img src={realmoji[emoji].url} className={s.emoji} />
                    )
                :
                    (
                        isFilePicked ?
                        <img src={URL.createObjectURL(selectedFile)} className={s.emoji} />
                        :
                        <div className={s.nomoji}>no realmoji</div>
                    )
            }

            <div className={s.details}>
                <div className={s.emoji}>{emoji}</div>
                <div className={s.utility}>
                    <label htmlFor={emoji} className={s.upload}>change realmoji</label>
                    <input id={emoji} type="file" name="file" onChange={fileHandler} />
                    {
                        isFilePicked ?
                        <button className={s.send} onClick={handleSubmission}>
                            {
                                loading ? <div className={l.loadertiny}></div> 
                                : (
                                    success ? 
                                    <FontAwesomeIcon icon={faCheck} className={s.success} /> 
                                        :
                                    <FontAwesomeIcon icon={faUpload} />
                                )
                            }
                        </button>
                        : ""
                    }
                </div>
            </div>
        </div>

    )
}