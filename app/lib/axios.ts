import axios from "axios";
import { getToken } from "./auth";

export const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
});


const isPublicRoute = (url: string | undefined, method: string | undefined) => {
    if (!url) return false;

    const methodLower = method?.toLowerCase() || 'get';

    // Auth routes
    if (url.startsWith('/login') || url.startsWith('/register')) return true;

    // Services (read-only for public)
    if (url.startsWith('/services') && methodLower === 'get') return true;

    // Bookings creation
    if (url.startsWith('/bookings') && methodLower === 'post') return true;

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