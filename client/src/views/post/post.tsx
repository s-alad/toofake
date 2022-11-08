import React, { useState } from 'react';
import './post.css';

function Post() {
    return (
        <div className='post'>
            <div className='images'>
                <div className='img one'>

                </div>
                <div className='img two'>

                </div>
            </div>
            <div className='functionality'>
                <input className='caption'>
                </input>
                <div className='submit'>
                    <input type={'checkbox'} onChange={()=>console.log('c')}></input>
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