import axios from "axios";

<<<<<<< HEAD
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
=======
// ============================================
// Axios Instance
// ============================================

const api = axios.create({

    baseURL: "http://localhost:5000/api",

    timeout: 60000,

    headers: {

        "Content-Type": "application/json"

    }

});

// ============================================
// Request Interceptor
// ============================================

api.interceptors.request.use(

    (config) => {

        // Future:
        // const token = localStorage.getItem("token");
        // if(token){
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;

    },

    (error) => Promise.reject(error)

);

// ============================================
// Response Interceptor
// ============================================

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response) {

            console.error(

                "API Error:",

                error.response.data

            );

        }

        else if (error.request) {

            console.error(

                "Backend not responding."

            );

        }

        else {

            console.error(

                error.message

            );

        }

        return Promise.reject(error);

    }

);

export default api;
>>>>>>> d00d74bb08a6a606256f3287d19cf131e9ab6b4d
