import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log("API URL", ApiUrl)
const baseUrl = ApiUrl && ApiUrl.trim() ? ApiUrl.trim() : 'http://localhost:8080';
const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true
})

console.log("Axios Base URL after creation:", axiosInstance.defaults.baseURL);

export default axiosInstance;