import React, { useState } from 'react';
import './post.css';

function Post() {

    const [selectedFileOne, setSelectedFileOne]: any = useState();
    const [selectedFileTwo, setSelectedFileTwo]: any = useState();
    const [isFirstFilePicked, setIsFirstFilePicked] = useState(false);
    const [isSecondFilePicked, setIsSecondFilePicked] = useState(false);


    function fileOneHandler(event: any) {
        setIsFirstFilePicked(true);
        setSelectedFileOne(event.target.files[0]);
    };

    function fileTwoHandler(event: any) {
        setSelectedFileTwo(event.target.files[0]);
        setIsSecondFilePicked(true);
    };

    function handleSubmission() {

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
                    <label htmlFor="file-one-upload" className='upload'>Choose Back image</label>
                    <input id="file-one-upload" type="file" name="file" onChange={fileTwoHandler} />
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
                <input className='caption' placeholder='your caption'>

                </input>
                <div className='submit'>
                    <input type={'checkbox'} onChange={() => console.log('c')}></input>
                    location?
                </div>
                <div className='submit'>
                    submit
                </div>
            </div>
        </div>
    )
}

export default Post;