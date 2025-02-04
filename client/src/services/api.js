import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',  // Set the backend server URL
});

export default axiosInstance;
