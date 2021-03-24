import{useState} from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import {Redirect} from 'react-router-dom'
import HostPage from './HostPage'


export default function HostLogin(props) {
    
    // home state for controlled form
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // error message for login 
    const [message, setMessage] = useState('')

    // handeling submit for the form
    const handleSubmit = async e => {
        try{
            e.preventDefault()

            const requestBody = {
                email: email,
                password: password
            }

            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/hosts/login`, requestBody)
            console.log(response)
            
            const {token} = response.data

            // save the response from token to  a local storage
            localStorage.setItem('jwtToken', token)
            
            // decode jwtTooken
            const decoded = jwt_decode(token)
            console.log(decoded)

            props.setCurrentUser(decoded)

        }catch(error){
            if(error.response.status === 400){
                setMessage(error.response.data.msg)
            }else{

                console.log(error)
            }
        }
    }
    if(props.currentUser) return <Redirect to='/HostPage' component={HostPage} currentUser={props.currentUser} />

    return (
        <div>
            <h1>Hello from HostLogin Page</h1>
            <p>{message}</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email-input">Email:</label>
                <input 
                    type="email"  
                    id="email-input"
                    placeholder='email'
                    onChange={e => setEmail(e.target.value)}
                    value={email}    
                />
                <label htmlFor="password-input">Password:</label>
                <input 
                    type="password"  
                    id="password-input"
                    placeholder='password'
                    onChange={e => setPassword(e.target.value)}
                    value={password}    
                />
                <input type="submit" value="Login"/>
            </form>
        </div>
    )

}