import React from 'react';
import { useState } from "react";
import PurpleButton from "../components/PurpleButton.jsx";
import YellowButton from "../components/YellowButton.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
//import { useNavigate } from "react-router";
import BlueButton from "../components/BlueButton.jsx";
import RedButton from "../components/RedButton.jsx";
//import { useAuth } from "../contexts/AuthContext";


const SignUp = () => {
    // const { logIn, googleSignIn, changePassword } = useAuth();
    // const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="bg-[#405BA4] w-100 shadow-xl shadow-black">
            <div className="bg-[#1B2851] max-w-md w-full p-10 space-y-8 shadow-2xl">
                <h2 className="text-center text-4xl font-extrabold text-white shrikhand-regular">
                    Welcome
                </h2>
                <p className="text-center text-gray-200">
                    Sign in to your account
                </p>
                <div className="login-with">
                    <div className="button-log flex justify-center flex-row">
                        <svg fill="white" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" width="24px" viewBox="0 0 56.6934 56.6934" version="1.1" style={{enableBackground: 'new 0 0 56.6934 56.6934'}} id="Layer_1" height="24px" className="icon"><path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017  c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139  c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649  c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805  c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294  c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196  c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372  C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836  C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078  c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138  C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z" /></svg>
                    </div>
                </div>
                <form method="POST" action="#" className="space-y-6">
                    <div className="relative">
                        <input placeholder="Jane Doe" className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-grey-200" required id="name" name="name" type="name" />
                        <label className="absolute left-0 -top-3.5 text-gray-200 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-grey-200 peer-focus:text-sm" htmlFor="name">Name</label>
                    </div>
                    <div className="relative">
                        <input placeholder="john@example.com" className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-grey-200" required id="email" name="email" type="email" />
                        <label className="absolute left-0 -top-3.5 text-gray-200 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-grey-200 peer-focus:text-sm" htmlFor="email">Email address</label>
                    </div>
                    <div className="relative">
                        <input placeholder="Password" className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-grey-200" required id="password" name="password" type={showPassword ? "text" : "password"} />
                        <button
                            type="button"
                            style={{background: "none", margin: "10px 0", width: "10px"}}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-transparent border-none outline-none focus:outline-none focus:ring-0 hover:bg-transparent active:bg-transparent p-0"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <label className="absolute left-0 -top-3.5 text-gray-200 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-grey-200 peer-focus:text-sm" htmlFor="password">Password</label>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-200">
                            <input className="form-checkbox h-4 w-4 text-gray-200 bg-gray-800 border-gray-300 rounded" type="checkbox" />
                            <span className="ml-2 p-1">Remember me </span>
                        </label>
                        <a className="text-sm text-[#364A85] hover:underline" href="#"> Forgot your password?</a>
                    </div>
                    <div className='flex items-center justify-center flex-row'>
                        <YellowButton text={'Sign Up'} />
                    </div>
                </form>
                <div className="text-center text-gray-300">
                    Already have an account?
                    <a className="text-purple-300 hover:underline" href="Login.jsx">Sign in</a>
                </div>
            </div></div>
    );
}

export default SignUp;
