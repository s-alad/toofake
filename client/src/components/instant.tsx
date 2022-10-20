import React from 'react';
import './instant.css';

type Instant = {
  avatar: string,
  username: string,
  late: string,
  icon: string,
  primary: string,
  secondary: string,
  location: string
  caption: string
}

function Instant({username, location, late, caption, primary, secondary, avatar}: Instant) {
    return (
      <div className='instant'>
        <div className='details'>
          <div className='icon'>
            <div className='avatar'>
              <img src={avatar}></img>
            </div>
          </div>
          <div className='information'>
            <div className='username'>
              {username}
            </div>
            <div className='location'>
              {location} · {late}
            </div>
          </div>
          <div className='extra'>
            
          </div>
        </div>
        <div className='event'>
          <div className='front'>
              <img src={primary}/>
              <div className='back'>
                <img src={secondary}/>
              </div>
            <div className='reactions'>

            </div>
          </div>
          
        </div>
        <div className='caption'>
          {caption}
        </div>
      </div>
    );
  }
  
  export default Instant;