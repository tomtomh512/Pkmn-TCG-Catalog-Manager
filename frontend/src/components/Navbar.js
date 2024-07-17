import React from 'react'
import logo from '../images/img.png'
import '../styles/Navbar.css';

export default function Navbar(props) {
    const {openLogin, loginInfo} = props

    const handleClick = () => openLogin()

    const handleLogOut = () => window.location.reload()

    return (
        <nav>
            <div className="navbar-left">
                <img src={logo} alt="logo"/>
                <h3> Pokémon TCG Catalog / Manager </h3>
            </div>
            <div className="navbar-right">
                {loginInfo.isLoggedIn ? (
                    <>
                        {loginInfo.username}
                        <input
                            type="button"
                            value="LOG OUT"
                            onClick={handleLogOut}
                        />
                    </>
                ) : (
                    <input
                        type="button"
                        value="LOG IN"
                        onClick={handleClick}
                    />
                )}
            </div>
        </nav>
    )
}