// hooks/useAuth.js
import { useInfoContext } from "../context/infoContext";

export const useAuth = () => {
  const { currentUser, setCurrentUser } = useInfoContext();

  const login = (user) => {
    localStorage.setItem("userId", user.id);
    localStorage.setItem("access_token", user.token);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("access_token");
    setCurrentUser(null);
  };

  const getCurrentUser = () => {
    return currentUser || null;
  };

  return { login, logout, getCurrentUser, currentUser };
};
