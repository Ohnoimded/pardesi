import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const LoginPage = () => {
  const { handleLogin } = useContext(AuthContext);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
    try {
      await handleLogin(credentials);
      // Redirect to dashboard or homepage
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
