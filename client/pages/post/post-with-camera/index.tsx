import { useState, useRef, useEffect } from "react";
import s from './postcamera.module.scss';
import useCheck from "@/utils/check";
import { useRouter } from "next/router";

export default function Post() {
    useCheck();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [failure, setFailure] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const [caption, setCaption] = useState('');
    const [primaryBase64, setPrimaryBase64] = useState('');
    const [secondaryBase64, setSecondaryBase64] = useState('');
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const [isPrimaryCaptured, setIsPrimaryCaptured] = useState(false);
    const [isSecondaryCaptured, setIsSecondaryCaptured] = useState(false);
    const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
    const [currentCapture, setCurrentCapture] = useState<'primary' | 'secondary' | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const getMediaStream = async () => {
            try {
                const constraints: MediaStreamConstraints = {
                    video: { deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined }
                };
                stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (err) {
                console.error("Error accessing the camera: ", err);
            }
        };

        if (cameraActive) {
            getMediaStream();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraActive, selectedCameraId]);

    useEffect(() => {
        const getCameraList = async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            if (videoDevices.length > 0) {
                setSelectedCameraId(videoDevices[0].deviceId); // Default to the first camera
            }
        };

        getCameraList();
    }, []);

    const captureImage = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = 1500;
                canvasRef.current.height = 2000;
                context.drawImage(videoRef.current, 0, 0, 1500, 2000);
                const imageBase64 = canvasRef.current.toDataURL('image/png');

                if (currentCapture === 'primary') {
                    setPrimaryBase64(imageBase64);
                    setIsPrimaryCaptured(true);
                } else if (currentCapture === 'secondary') {
                    setSecondaryBase64(imageBase64);
                    setIsSecondaryCaptured(true);
                }

                stopCamera();
            }
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setCameraActive(false);
    };

    const handleCameraToggle = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
            const currentIndex = videoDevices.findIndex(device => device.deviceId === selectedCameraId);
            const nextIndex = (currentIndex + 1) % videoDevices.length;
            setSelectedCameraId(videoDevices[nextIndex].deviceId);
        }
    };

    const handleCameraModalOpen = (type: 'primary' | 'secondary') => {
        setCurrentCapture(type);
        setIsPrimaryCaptured(type === 'primary' ? false : isPrimaryCaptured);
        setIsSecondaryCaptured(type === 'secondary' ? false : isSecondaryCaptured);
        setCameraActive(true);
    };

    const handleSubmission = () => {
        setLoading(true);

        const authorization_token = localStorage.getItem("token");

        fetch("/api/add/post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                primaryb64: primaryBase64,
                secondaryb64: secondaryBase64,
                caption: caption,
                token: authorization_token
            })
        })
            .then(response => {
                if (response.ok) {
                    setLoading(false);
                    setSuccess("Successfully posted!");
                    setTimeout(() => { setSuccess(""); router.push("/feed") }, 3000);
                } else {
                    throw new Error("Error: " + response.statusText);
                }
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
                setFailure(error.message);
                setTimeout(() => { setFailure("") }, 5000);
            });
    };

    return (
        <div>
            <button className={s.switchMode} onClick={() => window.location.replace("/post")}>
                Upload Images From Device
            </button>
            <div className={s.images}>
                <div className={s.img}>
                    <button className={s.upload} onClick={() => handleCameraModalOpen('primary')}>
                        Take Back Image Using Camera
                    </button>
                    {isPrimaryCaptured && (
                        <div className={s.preview}>
                            <img src={primaryBase64} alt="Back Image" />
                        </div>
                    )}
                </div>
                <div className={s.img}>
                    <button className={s.upload} onClick={() => handleCameraModalOpen('secondary')}>
                        Take Front Image Using Camera
                    </button>
                    {isSecondaryCaptured && (
                        <div className={s.preview}>
                            <img src={secondaryBase64} alt="Front Image" />
                        </div>
                    )}
                </div>
            </div>
            <input 
                className={s.caption} 
                placeholder='captions not working, set them after you post in your app!' 
                onChange={(txt) => setCaption(txt.target.value)} 
                disabled 
            />
            <div className={s.submit} onClick={handleSubmission}>Post</div>
            <div className={s.info}>
                *The photos taken here won't look perfect in the app for everyone else, but it's close.<br />
            </div>
            {failure && <div className={s.failure}>{failure}</div>}
            {loading && <div className={s.loading}>loading...</div>}
            {success && <div className={s.success}>{success}</div>}

            {cameraActive && (
                <div className={s.cameraModal}>
                    <video ref={videoRef} className={s.video}></video>
                    <div className={s.cameraControls}>
                        <button className={s.swapButton} onClick={handleCameraToggle}>Swap Camera</button>
                        <button className={s.captureButton} onClick={captureImage}>Take Image</button>
                        <button className={s.closeButton} onClick={stopCamera}>Close</button>
                    </div>
                    <canvas ref={canvasRef} className={s.canvas}></canvas>
                </div>
            )}
        </div>
    );
}
