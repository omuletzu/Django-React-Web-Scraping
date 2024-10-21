import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import "../styles/Form.css"

function Form({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                console.log("Logged in, redirecting to home page")
                localStorage.setItem(ACCESS_TOKEN, res.data.acces);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                console.log("Registered, redirecting to login page")
                console.log(res)
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='form-container'>
            <h1>{name}</h1>
            <input
                className='form-input'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
            />
            {method === "register" && (
                <input
                    className='form-input'
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                />
            )}
            <input
                className='form-input'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
            />
            <button className='form-button' type='submit'>
                {name}
            </button>
        </form>
    )
}

export default Form