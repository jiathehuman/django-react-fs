// Write interceptor to add correct headers using Axios
// Check if we have access token

import axios from "axios"
import {ACCESS_TOKEN} from "./constants"

const apiUrl = "/choreo-apis/github-react-fs/backend/v1"

const api = axios.create({
    // import anything set inside env file
    // to set the base url to localhost 8000
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token){
            // Create an authorisation header to be handled by Axios
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Going forward to use this api to automatically add headers
// Instead of plain axios
export default api