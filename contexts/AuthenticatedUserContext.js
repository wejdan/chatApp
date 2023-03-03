import {updateDoc, doc} from 'firebase/firestore';
import React, {createContext, useCallback, useEffect, useState} from 'react';
import {auth, database} from '../firebase';

export const AuthenticatedUserContext = createContext();

export const ContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const updateUser = useCallback(() => {
    // setMessages([...messages, msgObj]);

    let docRef = doc(database, 'users', auth.currentUser.uid);

    updateDoc(docRef, {
      //  lastSeen: new Date(),
      isOnline: true,
    });
  }, []);
  useEffect(() => {
    if (user) {
      updateUser();
    }
  }, [user]);

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
