import React from 'react';
import PurpleButton from "../components/PurpleButton.jsx";
import YellowButton from "../components/YellowButton.jsx";

const Login = () => {
    return (
        <div className='bg-[#2C8A3A]'>
        <div style={{animation: 'slideInFromLeft 1s ease-out'}} className="max-w-md w-full overflow-hidden p-8 space-y-8 shadow-[0px_-20px_20px_0px_rgba(63,179,72,0.3)]">
            <h2 style={{animation: 'appear 2s ease-out'}} className="text-center text-4xl font-extrabold text-white">
                Welcome
            </h2>
            <p style={{animation: 'appear 3s ease-out'}} className="text-center text-gray-200">
                Sign in to your account
            </p>
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
                    <input placeholder="Password" className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-grey-200" required id="password" name="password" type="password" />
                    <label className="absolute left-0 -top-3.5 text-gray-200 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-grey-200 peer-focus:text-sm" htmlFor="password">Password</label>
                </div>
                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-gray-200">
                        <input className="form-checkbox h-4 w-4 text-gray-200 bg-gray-800 border-gray-300 rounded" type="checkbox" />
                        <span className="ml-2 p-1">Remember me </span>
                    </label>
                    <a className="text-sm text-[#364A85] hover:underline" href="#"> Forgot your password?</a>
                </div>
                <div className='flex items-center justify-between flex-row'>
                <PurpleButton text={'Login'} />
                <YellowButton text={'Sign Up'} />
                </div>
            </form>
            <div className="text-center text-gray-300">
                Don't have an account?
                <a className="text-purple-300 hover:underline" href="#">Sign up</a>
            </div>
        </div></div>
    );
}

export default Login;
