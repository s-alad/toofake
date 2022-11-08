import React from 'react';
import './App.css';
import { useState, useEffect  } from 'react';
import Login from './views/login/login';
import Home from './views/home/home';
import gitlogo from './static/gitlogo.png';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import About from './views/about/about';
import Post from './views/post/post';

function App() {

  const [login, setLogin] = useState(false)
  const [back, setBack] = useState(false)
  function auth() {setLogin(true);}

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
            localStorage.setItem('expiration', (Date.now() + parseInt(data['expires_in']) * 1000).toString())
          }
        ).then(
          () => {
            setLogin(true)
            return login;
          }
        )
      }
      return login;
    } else {return login}
  }

  function logout() {
    localStorage.clear()
    setLogin(false)
    verify();
  }

  return (
    <div className="App">
      <Router>
        <div className='toofake'>
            TooFake
            {
              verify() ?
                <div className='functionality'>
                  {
                    back === false ?
                    <div className='functionality'>
                      <div className='space'>|</div>
                      <Link className='befake' to="/post" onClick={() => {setBack(true)}}>post a bereal</Link>
                    </div>
                    :
                    <div className='functionality'>
                      <div className='space'>|</div>
                      <Link className='befake' to="/" onClick={() => {setBack(false)}}>back</Link>
                    </div>
                  }
                  <div className='space'>|</div>
                  <div className='logout' onClick={() => logout()}>logout</div>
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
        
        <div className='git'>
          <a href='https://github.com/s-alad/toofake' target="_blank">
            <img src={gitlogo} /> source code
          </a>
          <div className='space'>|</div>
          <a href='' onClick={() => {setBack(true)}}><Link to="/about">about</Link></a>
        </div>
      </Router>
    </div>
  );
}

export default App;
