import { Navigate } from "react-router-dom";
import { useInfoContext } from "../context/infoContext";

const ProtectedRoute = ({ children }) => {
  const { userId } = useInfoContext();

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
