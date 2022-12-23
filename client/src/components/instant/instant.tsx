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
  comments: any
}

function Instant({username, location, late, caption, primary, secondary, avatar, reactions, comments}: Instant) {

    const [expanded, setExpanded] = useState(false);
    function expand() {
        setExpanded(!expanded);
    }
    function minimize () {
        setExpanded(false);
    }

    function logComments() {
        console.log(comments)
        return ''
    }
    function addComment() {
        console.log('add comment')
    }

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
                return <div className='reaction' key={idx}>
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
        {
          comments.length != 0 ?
            <div className='comment-control'>
              <div className='seperator'></div> 
              {
                expanded ? 
                <div className='toggle' onClick={() => minimize()}> minimize comments ⮥</div> 
                : 
                <div className='toggle' onClick={() => expand()}>expand comments ↴</div>}
            </div>
          : <div className='placeholder'></div>
        }
        {
          comments.length != 0 && expanded == true? 
            <div className='comments'>
              {comments.map(function(data:any, idx:any) {
                logComments()
                return <div className='comment' key={idx}>
                    <div className='avatar'>
                      <img src={data.user.profilePicture.url}></img>
                    </div>
                    <div className='username'> {data.userName} </div>
                    <div className='text'> {data.text} </div>
                  </div>
                })
              }
            </div> 
          : 
            <div></div>
        }   
        <div className='add'>
          <input></input>
          <div className='button' onClick={() => addComment()}>comment</div>
        </div>
      </div>
    );
  }
  
  export default Instant;