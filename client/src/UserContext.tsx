import { message } from 'antd';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from './types/user';

export type UserContextType = {
    user: User | undefined;
    registerUser: (email: string, password: string, confirmPassword: string) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    loadUser: () => Promise<void>;
    clearUser: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const { t } = useTranslation();

    const registerUser = async (email: string, password: string, confirmPassword: string) => {
        await axios.post('http://localhost:8000/api/register', { email, password, password_confirmation: confirmPassword });
    };

    const loginUser = async (email: string, password: string) => {
        const response = await axios.post('http://localhost:8000/api/login', { email, password });
        sessionStorage.setItem('collectionist-token', `Bearer ${response.data.token}`);
    };

    const loadUser = async () => {
        try {
            const token = sessionStorage.getItem('collectionist-token');

            if (!token) {
                setUser(undefined);
                return;
            }
            
            const userDetails = await axios({
                method: 'get',
                url: 'http://localhost:8000/api/user',
                headers: {
                    'Authorization': token
                }
            });
            setUser(userDetails.data.user);
        } catch (error) {
            message.error(t('common.messages.error'));
            console.log(error);
        }
    };

    const clearUser = () => {
        sessionStorage.removeItem('collectionist-token');
        setUser(undefined);
    };

    return (
        <UserContext.Provider value={{ user, registerUser, loginUser, loadUser, clearUser }}>
            { children }
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext) as UserContextType;