import React, {useState} from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import {Link, useNavigate} from "react-router-dom";
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        let profileImageUrl = "";

        if(!fullName) {
            setError("Please enter your name");
            return;
        }

        if(!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError(""); 

        // SignUp API Later
    }

    return (
        <AuthLayout>
            <div className="w-full lg:w-[70%] flex flex-col justify-center min-h-[70vh] md:min-h-full">
                <h3 className = "text-xl font-bold text-black">Create an Account</h3>
                <p className = "text-xs text-slate 700 mt-[5px] mb-6">
                    Take your first step towards better finances.
                </p>

                <form onSubmit = {handleSignUp}>
                    <ProfilePhotoSelector image = {profilePic} setImage = {setProfilePic} />

                    <div className = "grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Input
                            value = {fullName}
                            onChange = {({target}) => setFullName(target.value)}
                            label={<span className="font-semibold">Full Name</span>}
                            placeholder = "Jane Doe"
                            type = "text"
                        />
                        <Input
                            value = {email}
                            onChange = {({target}) => setEmail(target.value)}
                            label={<span className="font-semibold">Email Address</span>}
                            placeholder = "jane@example.com"
                            type = "text"
                        />
                        <div className = "col-span-2">
                            <Input
                                value = {password}
                                onChange = {({target}) => setPassword(target.value)}
                                label={<span className="font-semibold">Password</span>}
                                placeholder = "Min. 8 Characters"
                                type = "password"
                            />
                        </div>
                    </div>

                    {error && <p className = "text-red-500 text-xs pb-2.5">{error}</p>}
                        <button type = "submit" className = "btn-primary cursor-pointer">
                            Sign Up
                        </button>
    
                        <p className = "text-[13px] text-slate-800 mt-3">
                            Already connected with us? {""}
                            <Link className = "font-medium text-primary underline" to = "/login">
                                Login Now
                            </Link>
                        </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default SignUp