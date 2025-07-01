// ./reducers/authReducer.js
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode

// Action Types (for better organization)
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

// Helper to get initial state from localStorage (e.g., after a page refresh)
const getInitialAuthState = () => {
    try {
        const token = localStorage.getItem('auth_token'); // Assuming you store the JWT here
        if (token) {
            const decodedToken = jwtDecode(token);
            return {
                isAuthenticated: true,
                user: decodedToken.user, // Or whatever user data is in your token
                userRole: decodedToken.role, // Assuming 'role' is in your JWT payload
                token: token,
                loading: false,
                error: null,
            };
        }
    } catch (error) {
        console.error("Error decoding token or parsing auth data:", error);
        localStorage.removeItem('auth_token'); // Clear invalid token
    }
    return {
        isAuthenticated: false,
        user: null,
        userRole: null,
        token: null,
        loading: false,
        error: null,
    };
};

const initialState = getInitialAuthState();

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            // Store token in localStorage
            localStorage.setItem('auth_token', action.payload.token);
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                userRole: action.payload.role,
                token: action.payload.token,
                loading: false,
                error: null,
            };
        case LOGIN_FAILURE:
            // Remove token from localStorage on failure
            localStorage.removeItem('auth_token');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                userRole: null,
                token: null,
                loading: false,
                error: action.payload,
            };
        case LOGOUT:
            // Remove token from localStorage on logout
            localStorage.removeItem('auth_token');
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                userRole: null,
                token: null,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};