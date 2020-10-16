import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const history = useHistory();
  const  userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const expiresAt = localStorage.getItem("expiresAt");
  
  const [authState, setAuthState] = useState({
    token: null,
    expiresAt,
    userInfo
  });

  function setAuthInfo({ token, userInfo, expiresAt }) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo))
    localStorage.setItem("expiresAt", expiresAt)
    setAuthState({ token, userInfo, expiresAt });
  }

  function isAuthenticated() {
    if (!authState.expiresAt) {
      return false;
    }

    return new Date().getTime() / 1000 < authState.expiresAt;
  }

  function logOut({ items }) {
    setAuthState({
      token: null,
      expiresAt: null,
      userInfo: {}
    })
    items.forEach(item => localStorage.removeItem(item));
    history.push("/login")
  }

  function isAdmin() {
    return authState.userInfo.role.toLowerCase() === "admin";
  }

  return (
    <Provider
      value={{
        isAdmin,
        isAuthenticated,
        logOut,
        authState,
        setAuthState(authInfo) {
          setAuthInfo(authInfo);
        }
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
