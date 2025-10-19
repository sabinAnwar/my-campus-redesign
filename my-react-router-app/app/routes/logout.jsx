import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };
    handleLogout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Logging out...</p>
      </div>
    </div>
  );
}