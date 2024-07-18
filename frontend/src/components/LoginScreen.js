import React, {useState} from 'react'
import logo from '../images/img.png'
import '../styles/LoginScreen.css';

export default function LoginScreen(props) {
    const {closeLogIn, handleLogIn} = props
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        isNewUser: false,
    })
    const [loginMessage, setLoginMessage] = useState("You must log in to save to a collection")

    const handleCancelClick = () => closeLogIn()

    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    function handleSubmit() {
        if (formData.username === '' || formData.password === '') {
            alert("Username and/or password cannot be empty")
            return
        }

        if (formData.isNewUser) {
            fetch("/sign_up", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.message === "User added successfully") {
                        setLoginMessage(data.message + " - Log in now")
                        setFormData(prevFormData => {
                            return {
                                username: "",
                                password: "",
                                isNewUser: false,
                            }
                        })
                    } else {
                        setLoginMessage(data.message)
                    }
                })
        } else {

            const queryParams = new URLSearchParams({
                username: formData.username || '',
                password: formData.password || '',
            }).toString()

            fetch(`/log_in?${queryParams}`)
                .then(res => res.json())
                .then(data => {
                    if (data.message === "User log in successfully") {
                        handleLogIn(formData.username, data.user_id)
                        closeLogIn()
                    } else {
                        setLoginMessage(data.message)
                    }
                })
        }
    }

    return (
        <div className="login-screen">

            <section>
                <img src={logo} alt="logo"/>
                Log In
                <img src={logo} alt="logo"/>
            </section>

            <section className="user-info">
                <div>
                    <label> Username </label> <br/>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="username"
                        value={formData.username}
                    />
                </div>
                <div>
                    <label> Password </label> <br/>
                    <input
                        type="password"
                        onChange={handleChange}
                        name="password"
                        value={formData.password}
                    />
                </div>
            </section>

            <p> {loginMessage} </p>

            <input
                type="button"
                value={formData.isNewUser ? "Sign Up" : "Log In"}
                className="login-button"
                onClick={handleSubmit}
            />

            <section className="extra">
                <div className="extra-left">
                    <label> New User? </label>
                    <input
                        type="checkbox"
                        className="radio-button"
                        checked={formData.isNewUser}
                        onChange={handleChange}
                        name="isNewUser"
                    />
                </div>
                <div className="extra-right">
                    <input
                        type="button"
                        value="Cancel"
                        className="cancel-button"
                        onClick={handleCancelClick}
                    />
                </div>
            </section>

        </div>
    )
}