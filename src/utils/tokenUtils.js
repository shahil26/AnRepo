const TOKEN_KEY = 'token';

// Set Token in LocalStorage
const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Get Access Token from LocalStorage
const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Remove Token from LocalStorage
const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export default {
    setToken,
    getToken,
    removeToken
};
