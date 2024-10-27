import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'https://carmagnole.ohnoimded.com';
const AuthContext = createContext();
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        errorMsg: '',
        registrationStatus: false,
        loginStatus: false
    });
    const [apiToken, setApiToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const getApiToken = useCallback(() => {
        const token = localStorage.getItem('api-access-token');
        setApiToken(token);
        return token;
    }, []);

    const setTokenInStorage = useCallback((newToken) => {
        setApiToken(newToken);
        if (newToken) {
            localStorage.setItem('api-access-token', newToken);
        } else {
            localStorage.removeItem('api-access-token');
        }
    }, []);

    const fetchNewToken = useCallback(async () => {
        const response = await axios.post(`${API_URL}/auth/api/token/`);
        if (response.data.access) {
            setTokenInStorage(response.data.access);
            return response.data.access;
        }
        throw new Error('No access token in response');
    }, [setTokenInStorage]);

    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/user/`, { withCredentials: true });
            setAuthState(prev => ({ ...prev, user: response.data }));
        } catch {
            setAuthState(prev => ({ ...prev, user: null }));
        }
    }, []);

    const initializeInterceptors = () => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (!config.url.includes('/auth/') && !config.url.includes('carmagnole-bucket.s3.eu-north-1.amazonaws.com')) {
                    const token = getApiToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await fetchNewToken();
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    } catch (tokenError) {
                        setTokenInStorage(null);
                        return Promise.reject(tokenError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    };

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            try {
                const token = getApiToken();
                if (!token) {
                    await fetchNewToken();
                }
                await checkAuthStatus();
            } catch (error) {
                console.error('Authentication initialization error:', error);
                setTokenInStorage(null);
            } finally {
                setIsLoading(false);
                setIsInitialized(true);
            }
        };

        initializeAuth();
        initializeInterceptors();
    }, []);

    const register = async (formData) => {
        setIsLoading(true);
        setAuthState(prev => ({ ...prev, errorMsg: '', registrationStatus: false }));
        try {
            const response = await axios.post(`${API_URL}/auth/user/register/`, formData, { withCredentials: true });
            if (response.status === 201) {
                setAuthState(prev => ({
                    ...prev,
                    registrationStatus: true,
                    errorMsg: 'User created, logging in...'
                }));
                await login(formData);
            }
        } catch (error) {
            handleAuthError(error, 'registration');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (formData) => {
        setIsLoading(true);
        setAuthState(prev => ({ ...prev, errorMsg: '', loginStatus: false }));
        try {
            const response = await axios.post(`${API_URL}/auth/user/login/`, formData, { withCredentials: true });
            if (response.status === 200) {
                setAuthState(prev => ({
                    ...prev,
                    user: response.data,
                    loginStatus: true,
                    errorMsg: ''
                }));
            }
        } catch (error) {
            handleAuthError(error, 'login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuthError = (error, type) => {
        let errorMsg = 'Network error. Try again!';
        if (error.response) {
            if (error.response.status === 409 && type === 'registration') {
                errorMsg = "User already exists!";
            } else if (error.response.status === 401 && type === 'login') {
                errorMsg = "Invalid credentials";
            } else {
                errorMsg = 'Something went wrong. Try again!';
            }
        }
        setAuthState(prev => ({
            ...prev,
            errorMsg,
            [type === 'registration' ? 'registrationStatus' : 'loginStatus']: false
        }));
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/user/logout/`, {}, { withCredentials: true });
            setAuthState(prev => ({ ...prev, user: null, loginStatus: false }));
            setTokenInStorage(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const contextValue = {
        fetchNewToken,
        register,
        login,
        logout,
        authState,
        isLoading,
        isInitialized,
        checkAuthStatus,
        apiToken
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
