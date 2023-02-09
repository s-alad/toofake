import React, { useState } from 'react';
import './post.css';

function Post() {
    
    const [loading, setLoading] = useState(false);

    const [valid, setValid] = useState(true);
    const [validContent, setValidContent] = useState('');

    const [publicpost, setPublic] = useState(false);

    const [haslocation, setHasLocation] = useState(false);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const [posting, setPosting] = useState(false);
    const [postContent, setPostContent] = useState('');

    const [caption, setCaption] = useState('');
    const [selectedFileOne, setSelectedFileOne]: any = useState();
    const [selectedFileTwo, setSelectedFileTwo]: any = useState();
    const [isFirstFilePicked, setIsFirstFilePicked] = useState(false);
    const [isSecondFilePicked, setIsSecondFilePicked] = useState(false);

    function handleValidation(content: any) {
        setValid(false);
        setValidContent(content);
        setTimeout(() => {
            setValid(true);
            setValidContent('');
        }, 5000);
    }
    function handlePostResponse(content: any) {
        setPosting(true);
        setPostContent(content);
    }

    function fileOneHandler(event: any) {
        setIsFirstFilePicked(true);
        setSelectedFileOne(event.target.files[0]);
    };

    function fileTwoHandler(event: any) {
        setIsSecondFilePicked(true);
        setSelectedFileTwo(event.target.files[0]);
    };

    function handleSubmission() {

        if (loading) {handleValidation('please wait for state to finish loading'); return}
        if (!selectedFileOne || !selectedFileTwo) {handleValidation('please select both images'); return}

        const data = new FormData();
        data.append('primary', selectedFileOne);
        data.append('secondary', selectedFileTwo);
        data.append('public', publicpost.toString())
        data.append('haslocation', haslocation.toString())
        data.append('latitude', latitude.toString())
        data.append('longitude', longitude.toString())

        let primary = URL.createObjectURL(selectedFileOne);
        let secondary = URL.createObjectURL(selectedFileTwo);

        let tok = localStorage.getItem('idtoken');
        let uid = localStorage.getItem('uid');

        console.log('trying to upload')
        console.log(tok, uid)
        console.log(primary, secondary)
        handlePostResponse('submitting request')
        /* fetch(`/postinstant/${tok}/${uid}/${caption}`, {method: 'POST', body: data}).then(
            (data) => {
                data.json().then((value) => {
                    console.log(value)
                    if ('error' in value) {
                        handleValidation(value.statusCode + " | " + value.error + ": " + value.errorKey)
                        setPosting(false);
                    } else {
                        handlePostResponse('success')
                        setTimeout(() => {
                            window.location.replace('/');
                        }, 3000);
                    }
                })
            }
        ) */
        fetch(`/signedpostinstant/${tok}/${uid}/${caption}`, {method: 'POST', body: data}).then(
            (data) => {
                data.json().then((value) => {
                    console.log(value)
                    if ('error' in value) {
                        handleValidation(value.statusCode + " | " + value.error + ": " + value.errorKey)
                        setPosting(false);
                    } else {
                        handlePostResponse('success')
                        setTimeout(() => {
                            window.location.replace('/');
                        }, 3000);
                    }
                })
            }
        ).catch((err) => {
            console.log(err)
            handleValidation('error')
            setPosting(false);
        })
    };

    async function toggleLocation() {
        console.log(loading)
        if (latitude !== 0 && longitude !== 0) {
            setLatitude(0);
            setLongitude(0);
        } else {
            await navigator.geolocation.getCurrentPosition(
            position => {
                console.log(position.coords.latitude, position.coords.longitude)
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            }
          );
        }
        
        setLoading(false);
    }

    return (
        <div className='post'>
            <div className='images'>
                <div className='img one'>
                    <label htmlFor="file-one-upload" className='upload'>Choose Front image</label>
                    <input id="file-one-upload" type="file" name="file" onChange={fileOneHandler} />
                    {isFirstFilePicked ? (
                        <div className='sub'>
                            {/* <p>Filename: {selectedFileOne.name}</p>
                            <p>Filetype: {selectedFileOne.type}</p>
                            <p>Size in bytes: {selectedFileOne.size}</p> */}
                            <img src={URL.createObjectURL(selectedFileOne)} />
                        </div>
                    ) : (
                        <>
                        </>
                    )}
                </div>
                <div className='img two'>
                    <label htmlFor="file-two-upload" className='upload'>Choose Back image</label>
                    <input id="file-two-upload" type="file" name="file" onChange={fileTwoHandler} />
                    {isSecondFilePicked ? (
                        <>
                            <div className='sub'>
                                {/* <p>Filename: {selectedFileOne.name}</p>
                                <p>Filetype: {selectedFileOne.type}</p>
                                <p>Size in bytes: {selectedFileOne.size}</p> */}
                                {/* <p className='data'>Filename: {selectedFileOne.name}</p> */}
                                <img src={URL.createObjectURL(selectedFileTwo)} />
                            </div>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>
            </div>
            <div className='functionality'>
                <input className='caption' placeholder='your caption' onChange={(txt) => setCaption(txt.target.value)}>

                </input>
                <div className='submit location'>
                    <input type={'checkbox'} onChange={() => toggleLocation()}></input>
                    location?
                </div>
                <div className='submit public'>
                    <input type={'checkbox'} onChange={() => {setPublic(!publicpost)}}></input>
                    public?
                </div>
            </div>
            <div className='send' onClick={()=> {setLoading(true); handleSubmission()}}>
                submit
            </div>
            {!valid ? (<div className='validation'>{validContent}</div>) : (<></>)}
            {!posting ? (<></>) : (<div className='posting'>{postContent}</div>)}
        </div>
    )
}

export default Post;