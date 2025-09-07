import { Outlet } from "react-router";

// This is a layout component for all user-related routes
export default function UsersLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
