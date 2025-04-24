import { jwtDecode } from 'jwt-decode';

// Function to decode token and get the expiration date (in milliseconds)
export const getTokenExpirationDate = (token) => {
    if (!token) return null;
    const decoded = jwtDecode(token); // Use the correct import
    return decoded.exp * 1000; // Convert expiration time to milliseconds
};

// Function to check if the token is expired
export const isTokenExpired = (token) => {
    if (!token) return true; // If no token, consider it expired
    const expirationDate = getTokenExpirationDate(token);
    return expirationDate < Date.now(); // Compare current time to expiration time
};
