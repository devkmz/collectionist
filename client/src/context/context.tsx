import React, { createContext, useContext, useReducer } from 'react';

import { initialState, UserReducer } from './reducer';

export const UserContext = createContext<any>(null);
const UserDispatchContext = createContext<any>(null);

export const useUserState = () => {
  const context = useContext(UserContext);
  return context || new Error();
};

export const useUserDispatch = () => {
  const context = useContext(UserDispatchContext);
  return context || new Error();
};

export const UserProvider = ({ children }: any) => {
  const [user, dispatch] = useReducer(UserReducer, initialState);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        { children }
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};