import React, {createContext, useState} from 'react';

export const AuthenticatedUserContext = createContext();

export const ContextProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthenticatedUserContext.Provider
      value={{
        user,
        setUser,
      }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
