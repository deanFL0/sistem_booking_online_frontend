import axios from "axios";
import { getToken, logout } from "./auth";

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1",
});

const isPublicRoute = (url: string | undefined, method: string | undefined) => {
    if (!url) return false;

    const methodLower = method?.toLowerCase() || 'get';

    // Auth routes
    if (url.startsWith('/login') || url.startsWith('/register')) return true;

    // Services (read-only for public)
    if (url.startsWith('/services') && methodLower === 'get') return true;

    // Bookings creation
    if (url === '/bookings' && methodLower === 'post') {
        return true;
    }

    // Guest bookings operations
    if (url.startsWith('/guest-bookings')) return true;

    return false;
};

api.interceptors.request.use((config) => {
    const token = getToken();

    // Only attach auth header for non-public routes
    if (token && !isPublicRoute(config.url, config.method)) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// return to login page when getting 401 response (token expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url;

        if (
            status === 401 &&
            url !== "/logout" &&
            !isPublicRoute(url, error.config?.method)
        ) {
            logout();

            window.dispatchEvent(new Event("unauthorized"));
        }

        return Promise.reject(error);
    }
);