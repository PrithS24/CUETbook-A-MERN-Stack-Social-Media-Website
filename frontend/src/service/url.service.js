// import axios from "axios";

// const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// if (!ApiUrl) {
//     console.error('API URL is not defined!');
// } else {
//     console.log('API URL:', ApiUrl);
// }

// // Only call trim if ApiUrl is not undefined
// const axiosInstance = axios.create({
//     baseURL: ApiUrl ? ApiUrl.trim() : '', // Fallback to empty string if undefined
//     withCredentials: true
// });


// export default axiosInstance;
import axios from "axios";

const ApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: ApiUrl,
    withCredentials:true
})

export default axiosInstance;