import axios from 'axios';
const axiosInstance = axios.create({

  //baseURL: 'http://13.236.187.98:5001', // local
  baseURL: 'http://54.153.147.159:5001', // live
  //baseURL: '/api', 
  headers: { 'Content-Type': 'application/json' },
});
//adding something
export default axiosInstance;
