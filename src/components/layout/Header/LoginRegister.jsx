import React, { useEffect, useState, useRef, } from 'react';
import styled from 'styled-components';
import { Link, useNavigate} from 'react-router-dom';
import { UserIcon,X } from 'lucide-react';
import AuthForm from '../LoginForm/AuthForm';
import { useAuth } from '../../../services/AuthContext';

const LoginRegisterContainer = styled.div`
font-family:  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;  
font-weight: normal;
font-size: 14px;

  position: relative;
  flex-basis: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--fr-red);
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--root-card-bg-dark);
  border: 1px solid var(--fr-blue);
  border-radius: 4px;
  height: ${props => (props.$isAuthDrop ? '170px' : '100px')};
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  z-index: 601;
  transition: visibility 367ms cubic-bezier(0.1, 0.9, 1.0, 1.0), opacity 267ms cubic-bezier(0.1, 0.9, 1.0, 1.0);
`;

const LoginBurgMenu = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;

  a, div {
    white-space: nowrap;
    text-decoration: none;
    text-align: center;
    font-size: 15px;
    color: var(--fr-red);
    padding: 5px;
    margin: 5px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  z-index: 700;
`;




function LoginRegister() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterinModalOpen] = useState(false);
  const { authState, logout } = useAuth();
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };
  
  const showLogin = () => {
    setIsDropdownOpen(false);  
    setLoginModalOpen(true); 
    setRegisterinModalOpen(false);

  };
  const showRegister = () => {
    setIsDropdownOpen(false);  
    setRegisterinModalOpen(true); 
    setLoginModalOpen(false);

  };

  const closeModal = () => {
    setLoginModalOpen(false);
    setRegisterinModalOpen(false);
  };


  useEffect(() => {
    if (authState.loginStatus) {
      window.location.reload();
    }
  }, [authState.loginStatus]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target) &&
        iconRef.current &&
        !iconRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    if (authState.user) {
      setLoginModalOpen(false);
      setRegisterinModalOpen(false);
    }
  }, [authState, navigate]);

  return (
    <LoginRegisterContainer>
      <IconButton onClick={toggleDropdown} ref={iconRef}>
        <UserIcon size={24} />
      </IconButton>
      
      <Dropdown $isOpen={isDropdownOpen} $isAuthDrop={!!authState.user} className='LoginDropDown' ref={dropdownRef}>
        {authState.user ? (
          <LoginBurgMenu>
            <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}><span>User: </span> <span> {authState.user.username}</span></div>
            <Link onClick={handleLogout}>Logout</Link>
            <span>Logout is disabled</span>
            {/* <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link> */}
          </LoginBurgMenu>
        ) : (
          <LoginBurgMenu>
            <Link onClick={showLogin}>Login</Link>
            <Link onClick={showRegister}>Register</Link>
          </LoginBurgMenu>
        )}
      </Dropdown>
      <ModalOverlay $isOpen={isLoginModalOpen || isRegisterModalOpen} onClick={closeModal} />
      {isLoginModalOpen && (
        <AuthForm formType="login" onRegLogClick={showRegister} />
      )}
      {isRegisterModalOpen && (
        <AuthForm formType="register" onRegLogClick={showLogin} />
      )}
    </LoginRegisterContainer>
  );
}

export default LoginRegister;