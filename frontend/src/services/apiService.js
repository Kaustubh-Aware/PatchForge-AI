import axios from "axios";

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