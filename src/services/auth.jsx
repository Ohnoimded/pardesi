// import axios from 'axios';

// const API_URL = 'http://localhost:8000';

// // User Login - user access token get
// const login = async (email, password) => {
//     try {
//         const response = await axios.post(`${API_URL}/auth/user/login/`, { email, password });

//         if (response.data.token) {
//             localStorage.setItem('user-access-token', response.data.token);
//             localStorage.setItem('user-refresh-token', response.data.refreshToken); 
//         }

//         return response.data;
//     } catch (error) {
//         console.error('Login error:', error);
//         throw error;
//     }
// };

// // User registration - user access token get (optional??)
// const register = async (email, username, password) => {
//     try {
//         const response = await axios.post(`${API_URL}/auth/user/register/`, { email, username, password });
//         return response.data;
//     } catch (error) {
//         console.error('Registration error:', error);
//         throw error;
//     }
// };

// // User Logout
// const logout = () => {
//     localStorage.removeItem('user-access-token');
//     localStorage.removeItem('user-refresh-token');
//     delete axios.defaults.headers.common['Authorization'];
// };

// // Get User Token from local
// const getUserToken = async () => {
//     return localStorage.getItem('user-token');
// };

// // Get API Token from backend
// const getApiToken_ = async () => {
//     console.log("Getting apitoken")
//     try {
//         if (localStorage.getItem('api-access-token')){
//             return localStorage.getItem('api-access-token');
//         }else{
//             console.log("GOing into else")
//             const response = await axios.post(`${API_URL}/auth/api/token/`);
//             await new Promise(r => setTimeout(r, 2000));
//             if (response.data['access']) {
//                 localStorage.setItem('api-access-token', response.data['access']);
//                 localStorage.setItem('api-refresh-token', response.data['refresh']); 
//             }
//             return response.data;
//     }
//     } catch (error) {
//         console.log("Api token present, but invalid")
//         localStorage.removeItem('api-access-token')
//         console.error('Get API Token error:', error);
//         throw error;
//     }
// };

// // Refresh tokens for both user and api
// const refreshToken = async (tokenType, token) => {
//     try {
//         let endpoint;
//         if (tokenType === 'user') {
//             endpoint = `${API_URL}/auth/user/refresh/`;
//         } else if (tokenType === 'api') {
//             endpoint = `${API_URL}/auth/api/refresh/`;
//         }

//         const response = await axios.post(endpoint, { token });

//         if (response.data['access']) {
//             localStorage.setItem(`${tokenType}-access-token`, response.data['access']);
//             localStorage.setItem(`${tokenType}-refresh-token`, response.data['refresh']); 
//         }

//         return response.data;
//     } catch (error) {
//         console.error('Token refresh error:', error);
//         throw error;
//     }
// };

// axios.interceptors.request.use(
//     async (config) => {
//         const apiToken = localStorage.getItem('api-access-token');
//         if (apiToken) {
//             config.headers['Authorization'] = `Bearer ${apiToken}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// axios.interceptors.response.use(
//     (response) => {
       
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;
//         // Check if the error status is 401 (Unauthorized) and if it's not a retry
//         if (error.response['status'] === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const newToken = await getApiToken_();
                
//                 // Update authorization headers with the new API token
//                 axios.defaults.headers.common['Authorization'] = `Bearer ${newToken.token}`;
//                 originalRequest.headers['Authorization'] = `Bearer ${newToken.token}`;
                
//                 return axios(originalRequest);
//             } catch (refreshError) {
//                 console.log("Refresh failed")
//                 console.error('Failed to refresh API token:', refreshError);
               
//             }
//         }

//         // Return the original error if conditions are not met for retrying
//         return Promise.reject(error);
//     }
// );

// export { login, register, logout, getUserToken, getApiToken_, refreshToken };
