import React, { useState } from 'react';
import './about.css';

function About() {
    return (
        <div className='about'>
            <h1>about</h1>
            <h4>hello there! 😄</h4>
            <p>if you're here you're probably interested in not using BeReal in the way it was intended to be used, and to be honest thats why I mainly started this project too! Don't worry, there's no judgment ;)</p>
            <p>a lot of credit goes towards the user <a href='https://shomil.me/bereal/'>shomil</a> who really gave much insight into reverse engineering BeReal's api. much credit also goes to <a href='https://github.com/notmarek/BeFake'>notmarek's</a> project which unraveled much of BeReals api into python code which I <s>stole</s> copy and pasted and used appropriately</p> 
            <p>there are still countless bugs and issues, so apologies if anything doesn't completely work as intended, send issues over via github!</p>
            <p>this project has also served as a great touch up many reactjs and python skills however it is still a work in progress. It is unkown if BeReal will change their api and break everything so feel free to reach out on github for any fixes that might come up!</p>
        </div>
    )
}

export default About;