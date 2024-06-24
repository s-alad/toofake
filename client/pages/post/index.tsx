import React, { useState } from "react";
import s from './post.module.scss'
import useCheck from "@/utils/check";
import { useRouter } from "next/router";

export default function Post() {

    useCheck();

    let router = useRouter();

    let [loading, setLoading] = useState<boolean>(false);
    let [failure, setFailure] = useState<string>("");
    let [success, setSuccess] = useState<string>("");

    const [caption, setCaption] = useState('');
    const [selectedFileOne, setSelectedFileOne]: any = useState<File | null>(null);
    const [selectedFileTwo, setSelectedFileTwo]: any = useState<File | null>(null);

    const [primaryBase64, setPrimaryBase64] = useState<string>('');
    const [secondaryBase64, setSecondaryBase64] = useState<string>('');

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    const fileHandler = async (
        event: React.ChangeEvent<HTMLInputElement>,
        setFile: React.Dispatch<React.SetStateAction<File | null>>,
        setBase64: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            try {
                const base64 = await getBase64(file);
                setBase64(base64);
            } catch (error) {
                console.error("Error converting file to base64:", error);
            }
        }
    }

    const handleSubmission = async () => {
        setLoading(true);
        setFailure("");
        setSuccess("");

        const authorizationToken = localStorage.getItem("token");

        try {
            const response = await fetch("/api/add/post", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    primaryb64: primaryBase64,
                    secondaryb64: secondaryBase64,
                    caption: caption,
                    token: authorizationToken
                })
            });

            if (response.ok) {
                setSuccess("Successfully posted!");
                setTimeout(() => {
                    setSuccess("");
                    router.push("/feed");
                }, 3000);
            } else {
                throw new Error("Error: " + response.statusText);
            }
        } catch (error: any) {
            console.error("Error posting data:", error);
            setFailure(error.message || "Unknown error");
            setTimeout(() => setFailure(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={s.images}>
                <div className={`${s.img}`}>
                    <label htmlFor="file-one-upload" className={s.upload}>Choose Back image</label>
                    <input
                        id="file-one-upload"
                        type="file"
                        name="file"
                        onChange={(e) => fileHandler(e, setSelectedFileOne, setPrimaryBase64)}
                    />
                    {selectedFileOne ? (
                        <div className={s.sub}>
                            <img src={URL.createObjectURL(selectedFileOne)}  alt="Selected back image" />
                        </div>
                    ) : (<></>)}
                </div>
                <div className={`${s.img}`}>
                    <label htmlFor="file-two-upload" className={s.upload}>Choose Front image</label>
                    <input
                        id="file-two-upload"
                        type="file"
                        name="file"
                        onChange={(e) => fileHandler(e, setSelectedFileTwo, setSecondaryBase64)}
                    />
                    {selectedFileTwo ? (
                        <>
                            <div className={s.sub}>
                                <img src={URL.createObjectURL(selectedFileTwo)} alt="Selected front image" />
                            </div>
                        </>
                    ) : (<></>)
                    }
                </div>
            </div>
            <input
                className={s.caption}
                placeholder='captions not working, set them after you post in your app!'
                onChange={(txt) => setCaption(txt.target.value)}
                disabled
            />
            <div className={s.submit} onClick={handleSubmission}>
                submit
            </div>
            <div className={s.info}>
                *some photos taken on an iphone (.heic) may not work. if there is an error try taking a screenshot of the image and uploading that instead.<br />
                *you might get a client-side exception if the image is too large. The maximum limit currently is 12mb for both images combined.
            </div>
            {failure && (
                <div className={s.failure}>
                    {failure}
                </div>
            )}
            {loading && (
                <div className={s.loading}>
                    Loading...
                </div>
            )}
            {success && (
                <div className={s.success}>
                    {success}
                </div>
            )}
        </div>
    )
}
