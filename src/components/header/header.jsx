
import './header.css'
import { useState } from 'react';
import OutlineBtn from '../outline btn/outlineBtn.jsx';
import Menu from '../hamburgerMenu/menu.jsx';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from "../../context/firebase";


// importing images
import arrowlogo_img from '/images/arrow_logo.svg';


function Header() {

    const navigate = useNavigate();
    const { initializing, isLoggedIn } = useFirebase();

    // while waiting on Firebase: render nothing (or I can add a spinner)
    if (initializing) return null;

    return (
        <div className="header">
            <div className='header-logo'>
                <img className='arrow' src={arrowlogo_img} alt="logo" />
                <h1>EASY2RIDE</h1>

            </div>
            {isLoggedIn ?
                <div className='bring-front'><Menu /></div> :
                <div className='bring-front'><OutlineBtn onClick={() => navigate('/login')} text="Login" className="header-login-btn" borderWeight='3px' /></div>
            }
        </div>
    );
}

export default Header;