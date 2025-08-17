import axios from 'axios';
const axiosInstance = axios.create({
  headers: { 'Content-Type': 'application/json' },
  //baseURL: 'http://13.236.187.98:5001', // local
  baseURL: 'http://13.236.187.98:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
