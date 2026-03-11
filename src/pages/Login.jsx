import React from 'react';

const Login = () => {
    return (
        <div>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Login</legend>

                <label className="label">Email or Phone number</label>
                <input type="email" className="input" placeholder="Email" />

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" />

                <div className='flex f'>
                <button className="btn btn-neutral mt-4">Login</button>
                <button className="btn btn-neutral mt-4">Register</button>
                </div>
            </fieldset>
        </div>
    );
};

export default Login;