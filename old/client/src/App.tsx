import React from 'react';
import './App.css';
import { useState, useEffect  } from 'react';
import Login from './views/login/login';
import Home from './views/home/home';
import gitlogo from './static/gitlogo.png';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import About from './views/about/about';
import Post from './views/post/post';
import { getme } from './api/auth';

function App() {
  const location = useLocation();
  const [login, setLogin] = useState(false)
  const [back, setBack] = useState(false)
  function auth() {
    setLogin(true);
    getme();
  }

  function verify(): boolean {
    if (localStorage.getItem('idtoken') != null) {
      if (Date.now() > parseInt(localStorage.getItem('expiration') ?? '0')) {
        const rtok = localStorage.getItem('refresh');
        fetch(`/refresh/${rtok}`).then(
          (value) => {return value.json()}
        ).then(
          (data) => {
            localStorage.setItem('refresh', data['refresh_token'])
            localStorage.setItem('idtoken', data['id_token'])
            localStorage.setItem('uid', data['user_id'])
            localStorage.setItem('expiration', (Date.now() + parseInt(data['expires_in']) * 1000).toString())
          }
        ).then(
          () => {
            setLogin(true)
            return login;
          }
        )
      }
      console.log(login)
      return true;
    } else {return login}
  }

  function logout() {
    localStorage.clear()
    setLogin(false)
    window.location.replace('/');
    verify();
  }

  function me() {
    let token = localStorage.getItem('idtoken') ?? ''
    fetch(`/me/${token}`).then(
      (value) => {return value.json()}
    ).then(
      (data) => {
        console.log(data)
      }
    )
  }

  useEffect(() => {
    if (window.location.pathname === '/') {
      setBack(false)
    }
  }, [location])
  

  return (
    <div className="App">

        <div className='toofake'>
            <Link to='/' onClick={() => {setBack(false)}}>TooFake</Link>
            {
              verify() ?
                <div className='functionality'>
                  {
                    back === false ?
                    <div className='functionality-inner'>
                      <div className='space'>|</div>
                      <Link className='befake' to="/post" onClick={() => {setBack(true)}}>post a bereal</Link>
                    </div>
                    :
                    <div className='functionality-inner'>
                      <div className='space'>|</div>
                      <Link className='befake' to="/" onClick={() => {setBack(false)}}>back</Link>
                    </div>
                  }
                  <div className='space'>|</div>
                  <div className='logout' onClick={() => logout()}>logout</div>
                  {/* <div className='space'>|</div>
                  <div className='logout' onClick={() => me()}>test</div> */}
                </div>
              :
              <div>
                {
                  back === true ? 
                  <div className='functionality'>
                    <div className='space'>|</div>
                    <Link className='befake' to="/" onClick={() => {setBack(false)}}>back</Link>
                  </div>
                  : ''
                }
              </div>  
            }
        </div>
        <div className='divider'></div>
        <Routes>
          <Route path='/' element={
            (verify()) ?
              <Home></Home> 
              :
              <Login auth={auth}></Login>
          }/>
          <Route path='about' element={<About></About>}/>
          <Route path='post' element={<Post></Post>}/>
        </Routes>
        <div className='issues'>
          <div className='divide'>

          </div>
          Recently more issues have started appearing as Bereal changes api,
          <br/>
          however everything should work fine. If any new issues pop up,
          <br/>
          feel free to send them over on the github!
          <br/>
        </div>
        <div className='divider'></div>
        <div className='git'>
          <a href='https://github.com/s-alad/toofake' target="_blank">
            <img src={gitlogo} /> source code
          </a>
          <div className='space'>|</div>
          <Link to='/about' onClick={() => {setBack(true)}}>about</Link>
        </div>
      
    </div>
  );
}

export default App;
