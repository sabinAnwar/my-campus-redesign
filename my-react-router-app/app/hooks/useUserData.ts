import { useEffect, useState } from "react";

/**
 * User data structure returned from API.
 */
export interface UserData {
  name: string;
  studyProgram: string;
  campusArea: string;
  roomBookingEnabled: boolean;
}

/** Default user data used as initial state and fallback. */
const DEFAULT_USER_DATA: UserData = {
  name: "",
  studyProgram: "",
  campusArea: "",
  roomBookingEnabled: true,
};

/**
 * Custom hook to fetch and manage user data from the API.
 * Handles session token authentication and provides fallback for development.
 *
 * @returns UserData object with user information
 *
 * @example
 * const { name, studyProgram, campusArea, roomBookingEnabled } = useUserData();
 */
export function useUserData(): UserData {
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const headers: Record<string, string> = {};
        if (sessionToken) {
          headers["X-Session-Token"] = sessionToken;
        }

        const response = await fetch("/api/user", {
          credentials: "include",
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          const user = data?.user;

          setUserData({
            name:
              user?.name && user.name !== "Student"
                ? user.name
                : "Demo Student", // Development fallback
            studyProgram: user?.studyProgram ?? "",
            campusArea: user?.campusArea ?? "",
            roomBookingEnabled: user?.roomBookingEnabled ?? true,
          });
        }
      } catch (error) {
        // Silently fail - user info is optional for UI rendering
        console.debug("Failed to fetch user info:", error);
      }
    };

    fetchUserData();
  }, []);

  return userData;
}
