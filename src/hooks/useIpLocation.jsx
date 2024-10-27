import axios from 'axios';

const ipLocInstance = axios.create({
    baseURL: 'https://ipapi.co/',
    withCredentials: false,
})


ipLocInstance.interceptors.response.use(
    (response) => {

        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const maxRetries = 5;

        if (!originalRequest.__retryCount) {
            originalRequest.__retryCount = 0;
        }

        if (originalRequest.__retryCount < maxRetries && error.response ) {
            originalRequest.__retryCount += 1;
            return ipLocInstance(originalRequest);
        }
        return Promise.reject(error);
    }


)

const getIpLocation = async () => {
    try {
        const response = await ipLocInstance.get('/json/');
        const ip_location = {
            ip: response.data.ip,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            city: response.data.city,
        };

        return ip_location;
    } catch (error) {
        console.log('Error fetching IP location:', error);
        return { ip: null, latitude: null, longitude: null, city: null };
    }
};

export default getIpLocation;
