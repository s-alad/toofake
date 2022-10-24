import React, { useState } from 'react';
import './instant.css';

type Instant = {
  avatar: string,
  username: string,
  late: string,
  icon: string,
  primary: string,
  secondary: string,
  location: string
  caption: string,
  reactions: Array<any>,
}

function Instant({username, location, late, caption, primary, secondary, avatar, reactions}: Instant) {

    const [main, setMain] = useState(true)

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
              {main ? <img src={primary}/> : <img src={secondary}/>}
              <div className='back' onClick={() => {setMain(!main)}}>
                {main ? <img src={secondary}/> : <img src={primary}/>}
              </div>
            <div className='reactions'>
              {reactions.map(function(data, idx) {
                return <div className='reaction'>
                    <img src={data.link}/>
                    <div className='emoji'> {data.emoji} </div>
                  </div>
              })}
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