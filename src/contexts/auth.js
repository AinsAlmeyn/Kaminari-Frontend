import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { getUser, signIn as sendSignInRequest } from '../api/auth';


function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const result = await getUser();
      if (result.isOk) {
        setUser(result.data);
      }

      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await sendSignInRequest(email, password);
    if (result.isOk) {
      setUser(result.data);
    }

    return result;
  }, []);

  const signOut = useCallback(() => {
    setUser(undefined);
    localStorage.clear();
  }, []);

  // AuthProvider componenti içinde

  const updateUser = useCallback((newUserData) => {
    setUser((currentUser) => ({
      ...currentUser,
      ...newUserData,
    }));
  }, []);

  // AuthContext.Provider içinde updateUser'ı value'ya ekle
  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateUser, loading }} {...props} />
  );

  // return (
  //   <AuthContext.Provider value={{ user, signIn, signOut, loading }} {...props} />
  // );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
