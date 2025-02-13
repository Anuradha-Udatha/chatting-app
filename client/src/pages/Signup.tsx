import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/google-auth", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/createprofile");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-xl font-bold">Sign up with Google</h1>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.error("Login Failed")} />
      </div>
    </div>
  );
};

export default Signup;
