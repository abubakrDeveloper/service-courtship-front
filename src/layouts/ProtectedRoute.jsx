import { Navigate } from "react-router-dom";
import { useInfoContext } from "../context/infoContext";
import { hasRole } from "../utils/roleUtils";

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, token } = useInfoContext();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser) {
    return <div>Yuklanmoqda...</div>; 
  }

  if (roles && !hasRole(currentUser, roles)) {
    console.log("keldi");
    
    return <Navigate to="/" replace />;
  }

  return children;

};

export default ProtectedRoute;
