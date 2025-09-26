// hooks/useAuth.js
import { useInfoContext } from "../context/infoContext";

export const useAuth = () => {
  const { currentUser, setCurrentUser } = useInfoContext();

  const login = (user) => {
    localStorage.setItem("token", user.token);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const getCurrentUser = () => {
    return currentUser || null;
  };

  return { login, logout, getCurrentUser, currentUser };
};
