import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useActionState } from "react";
import axios from 'axios';
import { useAuth } from '../services/AuthContext';
import { Audio,ThreeDots } from 'react-loader-spinner'

// import { signUpNewUser } from "./api";

const NewsletterSubscribe = styled.div`



font-family:  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;  
font-weight: normal;
font-size: 16px;
width:100%;

.newsletterform {
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin-top: 70px;
    align-items: center;
}

#signup-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    align-items: flex-start;
}

.label-n-input {
    display: inline-flex;
    flex-direction: row;
    gap: 25px;
    justify-content: center;
    align-items: center;
}

.label-n-input div {
    min-height: 50px;
    display:flex;
    flex-direction: row;
    justify-content: center;
}

strong{
 font-weight:bold;
}

 #beta {
    float: top;
    top: 9em;
    left: 0em;
    position: absolute; /* or fixed if you want it to always be visible */
    // transform: rotate(-45deg);
    background: red;
    color: white;
    font-weight: bold;
    padding-left: 3em;  padding-right: 3em;
    padding-top: .5em;  padding-bottom: .5em;
    border: 0;  margin: 0;
    height: auto;   width: auto;
    z-index: 999999999; /* or whatever is needed to show on top of other elements */
}
#beta::before {
    content: "⚠️ BETA ⚠️";
}
`;
const API_URL = 'https://carmagnole.ohnoimded.com';


const Newsletter = () => {
    const { apiToken } = useAuth();
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [isLoading, setLoading] = useState(false);

    
    const submitSubscription = async (event) => {
        event.preventDefault();
        setMessage("");
        setLoading(true);
        // const email  = formData.get("email");

        try {
            const response = await axios.post(
                `${API_URL}/api/newsletter/subscribe/`,
                { "email": email, },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiToken}`
                    },
                    withCredentials: true

                })
            setMessage("Thank you for subscribing to our free daily newsletter!")
            console.log(response);
        }
        catch (err) {
            if (err.response && err.response.status === 422){

                setMessage("Invalid email!")
            }
            else if (err.response && err.response.status === 503) {
                navigate('/503');
            }
            else if (err.response && err.response.status === 400) {
                setMessage("Please enter an email id!");
            }
            else{setMessage("Please reload the page and submit again")}
        }
        finally {
            setLoading(false);
        }

    };


    return (
        <NewsletterSubscribe>
            <h1 style={{ fontSize: "30px", marginBottom: '100px' }}>Newsletters </h1>
            <h4 >Our newsletters are <strong>free</strong> for all forever! Currently we have 1 newsletter, but more on the way.</h4>
            <div className='newsletterform'>
                <form id="signup-form" onSubmit={submitSubscription}>
                    <label htmlFor="newsletter-email">Subsribe to our <strong>free</strong> daily e-mail newsletter </label>
                    <div className='label-n-input'>
                        <div className="w-full max-w-sm min-w-[200px]">
                            <input
                                // type='email'
                                name="email"
                                id="newsletter-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your e-mail id here"
                                className="w-full bg-transparent placeholder:text-[var(--darth-dark)]-800 text-[var(--root-bg-dark)] text-sm border border-slate-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            />
                        </div>

                        <button type="submit"
                            disabled={isLoading}
                            className="newsletter-sbmt-btn w-48 rounded-md bg-[var(--fr-red)] text-center content-center py-3.5 px-5 text-nowrap border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-[var(--fr-red)] focus:shadow-none active:bg-[var(--fr-red)] hover:bg-[var(--fr-red)] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">

                            {isLoading ? "Subscribing..." : "Subscribe"}
                        </button>
                    </div>
                    {message && <p style={{ fontSize: '12px' }}>{message}</p>}
                </form>
            </div>
            {/* <hr id="beta" aria-label="Warning this page is a beta."></hr> */}
        </NewsletterSubscribe>
    );
};

export default Newsletter;




