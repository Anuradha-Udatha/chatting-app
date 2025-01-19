import { useState } from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import Inputbox from '../components/Inputbox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signin = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
      return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label="Sign in"></Heading>
          <SubHeading label="Enter your credentials to access your account"></SubHeading>
          <Inputbox label="Email" onChange={e=>{setEmail(e.target.value);}} placeholder="anuradha@gmail.com"></Inputbox>
          <Inputbox label="Password" onChange={e=>{setPassword(e.target.value);}} placeholder="123456"></Inputbox>
          <div className="pt-4">
              <Button 
              onClick={async()=>{
                const response = await axios.post("http://localhost:3000/api/v1/user/signin",{
                  email,
                  password
                });
                localStorage.setItem("token",response.data.token)
                navigate("/dashboard");
              }}
              label="Sign in"/>
          </div>
          <BottomWarning label="Not having an account?" buttonText="Sign up" to="/signup" ></BottomWarning>
        </div>
      </div>
    </div>
  )
}

export default Signin
