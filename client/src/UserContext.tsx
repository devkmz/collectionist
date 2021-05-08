import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import { User } from './types/user';

export type UserContextType = {
    user: User | undefined;
    registerUser: (email: string, password: string, confirmPassword: string, onSuccess: () => void) => Promise<void>;
    loginUser: (email: string, password: string, onSuccess: () => void) => Promise<void>;
    loadUser: () => Promise<void>;
    clearUser: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    const registerUser = async (email: string, password: string, confirmPassword: string, onSuccess: () => void) => {
        try {
            await axios.post('http://localhost:8000/api/register', { email, password, password_confirmation: confirmPassword });
            onSuccess();
        } catch (error) {
            console.log(error);
        }
    };

    const loginUser = async (email: string, password: string, onSuccess: () => void) => {
        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });
            localStorage.setItem('collectionist-token', response.data.token);
            onSuccess();
        } catch (error) {
            console.log(error);
        }
    };

    const loadUser = async () => {
        try {
            const token = localStorage.getItem('collectionist-token');

            if (!token) {
                setUser(undefined);
                return;
            }
            
            const userDetails = await axios({
                method: 'get',
                url: 'http://localhost:8000/api/user',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser({ ...userDetails.data.user, role: 'ADMIN' });
        } catch (error) {
            console.log(error);
        }
    };

    const clearUser = () => {
        localStorage.removeItem('collectionist-token');
        setUser(undefined);
    };

    return (
        <UserContext.Provider value={{ user, registerUser, loginUser, loadUser, clearUser }}>
            { children }
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext) as UserContextType;