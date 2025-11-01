import { Outlet } from "react-router";

// This is a layout component for all user-related routes
export const loader = async () => {
  return null;
};

export default function UsersLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
