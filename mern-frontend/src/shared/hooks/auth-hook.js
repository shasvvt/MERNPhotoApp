import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpDate, setTokenExpDate] = useState()
    const [userId, setUserId] = useState();

    const login = useCallback((userId, token, expirationDate) => {
        setToken(token);
        setUserId(userId);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpDate(tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify({
            userId: userId,
            token: token,
            expiration: tokenExpirationDate.toISOString()
        }))
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem('userData');
        setUserId(null);
        setTokenExpDate(null);
    }, []);

    useEffect(() => {
        if (token && tokenExpDate) {
            const remainingTime = tokenExpDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime)
        }
        else {
            clearTimeout(logoutTimer);
        }
    }, [token, tokenExpDate, logout])

    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        if (storedUserData &&
            storedUserData.token &&
            new Date(storedUserData.expiration) > new Date()
        ) {
            login(storedUserData.userId, storedUserData.token, new Date(storedUserData.expiration));
        }
    }, [login]);

    return { userId, token, login, logout };

}