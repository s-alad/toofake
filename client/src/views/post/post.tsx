import React, { useState } from 'react';
import './post.css';

function Post() {
    
    const [valid, setValid] = useState(true);
    const [caption, setCaption] = useState('');
    const [selectedFileOne, setSelectedFileOne]: any = useState();
    const [selectedFileTwo, setSelectedFileTwo]: any = useState();
    const [isFirstFilePicked, setIsFirstFilePicked] = useState(false);
    const [isSecondFilePicked, setIsSecondFilePicked] = useState(false);


    function fileOneHandler(event: any) {
        setIsFirstFilePicked(true);
        setSelectedFileOne(event.target.files[0]);
    };

    function fileTwoHandler(event: any) {
        setIsSecondFilePicked(true);
        setSelectedFileTwo(event.target.files[0]);
    };

    function handleSubmission() {

        if (!selectedFileOne || !selectedFileTwo) {
            setValid(false);
            //wait 5 seconds then reset
            setTimeout(() => {
                setValid(true);
            }, 3000);
        }

        const data = new FormData();
        data.append('primary', selectedFileOne);
        data.append('secondary', selectedFileTwo);

        let primary = URL.createObjectURL(selectedFileOne);
        let secondary = URL.createObjectURL(selectedFileTwo);

        let tok = localStorage.getItem('idtoken');
        let uid = localStorage.getItem('uid');

        console.log('trying to upload')
        console.log(tok, uid)
        console.log(primary, secondary)
        fetch(`/postinstant/${tok}/${uid}/${caption}`, {method: 'POST', body: data}).then(
            (value) => {
                console.log(value)
            }
        )

    };

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
                    <input type={'checkbox'} onChange={() => console.log('c')} disabled={true}></input>
                    location?
                </div>
                <div className='submit public'>
                    <input type={'checkbox'} onChange={() => console.log('c')}></input>
                    public?
                </div>
            </div>
            <div className='send' onClick={handleSubmission}>
                submit
            </div>
            {!valid ? (<div className='validation'>please select both images</div>) : (<></>)}
        </div>
    )
}

export default Post;