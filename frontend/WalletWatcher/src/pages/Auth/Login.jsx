import React, {useState, useContext} from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from "../../components/Inputs/Input";
import {Link, useNavigate} from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import {UserContext} from "../../context/userContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const {updateUser} = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter the password");
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });

            const {token, user} = response.data;

            if (token) {
                localStorage.setItem("token", token);
                updateUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError ("Something went wrong. Try again later.");
            }
        }
    }

    return (
        <AuthLayout>
            <div className="w-full lg:w-[70%] flex flex-col justify-center min-h-[70vh] md:min-h-full">
            {/* Fixed above using AI <div className = "lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center"> */} 
                <h3 className = "text-xl font-bold text-black">Welcome Back!</h3>
                <p className = "text-xs text-slate-700 mt-[5px] mb-6">
                    Let's log you in.
                </p>

                <form onSubmit = {handleLogin}>
                    <Input
                        value = {email}
                        onChange = {({target}) => setEmail(target.value)}
                        label={<span className="font-semibold">Email Address</span>}
                        placeholder = "jane@example.com"
                        type = "text"
                    />

                    <Input
                        value = {password}
                        onChange = {({target}) => setPassword(target.value)}
                        label={<span className="font-semibold">Password</span>}
                        placeholder = ""
                        type = "password"
                    />

                    {error && <p className = "text-red-500 text-xs pb-2.5">{error}</p>}

                    <button type = "submit" className = "btn-primary cursor-pointer">
                        Login
                    </button>

                    <p className = "text-[13px] text-slate-800 mt-3">
                        Don't have an account yet? {""}
                        <Link className = "font-medium text-primary underline" to = "/signup">
                            SignUp Now
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;