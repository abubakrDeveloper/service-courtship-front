import { Navigate } from "react-router-dom";
import { useInfoContext } from "../context/infoContext";
import { hasRole, ROLES } from "../utils/roleUtils";

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, userId } = useInfoContext();

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser) {
    return <div>Yuklanmoqda...</div>; // userId bor, lekin hali user load bo‘lmadi
  }

  if (roles && !hasRole(currentUser, roles)) {
    return <Navigate to="/" replace />;
  }

  return children;

};

export default ProtectedRoute;
