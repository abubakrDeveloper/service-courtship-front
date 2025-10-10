import { Navigate } from "react-router-dom";
import { useInfoContext } from "../context/infoContext";
import { hasRole } from "../utils/roleUtils";
import { Flex, Spin } from "antd";

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, token } = useInfoContext();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser) {
    return <div style={{display: "flex", alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
    <Spin size="large" />
  </div>; 
  }

  if (roles && !hasRole(currentUser, roles)) {    
    return <Navigate to="/" replace />;
  }

  return children;

};

export default ProtectedRoute;
