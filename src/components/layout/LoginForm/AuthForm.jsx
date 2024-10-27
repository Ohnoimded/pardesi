import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../services/AuthContext';

const ModalContainer = styled.div`

font-family:  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;  
font-weight: normal;
font-size: 14px;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--root-card-bg-dark);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 701;
  width: 300px;
  height: ${props => (props.$formType === 'register' ? '400px' : '300px')};
  display: flex;

  form {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 100%;

    p {
      text-align: center;
      margin: 0;
      font-size: 22px;
      padding: 0;
    }

    div > input {
      width: 100%;
      height: 40px;
      margin: 8px 0;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid var(--fr-blue);
      box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.2);
      font-family: inherit;
      font-size: 1em;
      line-height: 1.45;
      outline: none;
      padding: 0.6em 1.45em 0.7em;
      transition: .18s ease-out;

      &:hover {
        box-shadow: inset 1px 2px 8px rgba(0, 0, 0, 0.02);
      }

      &:focus {
        color: var(--darth-dark);
        border: 1px solid #B8B6B6;
        box-shadow: inset 1px 2px 4px rgba(0, 0, 0, 0.01), 0px 0px 8px rgba(0, 0, 0, 0.2);
      }
    }

    .modal-bottom {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: flex-end;
      flex-direction: row;
    }

    button {
      height: 40px;
      width: 90px;
      align-text:center:
      padding:5px;
      box-sizing: border-box;
      letter-spacing: 2.5px;
      font-weight: 500;
      color: black;
      background-color: white;
      border: none;
      border-radius: 4px;
      box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease 0s;
      cursor: pointer;
      outline: none;

      &:hover {
        background-color: var(--fr-red);
        box-shadow: 0px 1px 5px var(--fr-red);
        color: var(--darth-dark);
        transform: translateY(2px);
      }
    }
  }
`;

const AuthForm = ({ formType, onRegLogClick }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const { login, register, authState, isLoading } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setError('');
  }, [formType]);

  useEffect(() => {
    if (authState.user && !isLoading){
      console.log("YAY")
      navigate('/'); // Redirect to dashboard or home page after successful login/register
    }
  }, [authState.user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (formType === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match");
          return;
        }
        await register(formData);

      } else {
        await login(formData);
      }
    } catch (err) {
      setError(authState.errorMsg || 'An error occurred');
    }

  };

  return (
    <ModalContainer $formType={formType}>
      <form onSubmit={handleSubmit}>
        <p>{formType === 'register' ? 'Register' : 'Login'}</p>
        {error && <div className="error-message">{error}</div>}
        <div>
          <input
            type='email'
            placeholder='Email'
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type='text'
            placeholder='Username'
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type='password'
            placeholder='Password'
            id='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {formType === 'register' && (
          <div>
            <input
              type='password'
              placeholder='Confirm Password'
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className='modal-bottom'>
          <Link onClick={onRegLogClick}>
            {formType === 'register' ? 'Login?' : 'Register?'}
          </Link>
          <button type='submit' className='btn-enable' disabled={isLoading}>
            {isLoading ? 'Pls wait' : (formType === 'register' ? 'Register' : 'Login')}
          </button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default AuthForm;