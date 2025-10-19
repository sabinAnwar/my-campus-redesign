import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
    };
    checkAuth();
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center py-16 bg-gray-50 rounded-3xl shadow-md mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome back, {user.name || user.username}!
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Access your academic resources, view your marks, and manage your
          student profile all in one place.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/marks"
            className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Your Marks
          </Link>
          <Link
            to="/profile"
            className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Manage Profile
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Course Materials
          </h3>
          <p className="text-gray-600 mb-4">
            Access your study materials, assignments, and course resources.
          </p>
          <Link
            to="/courses"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Browse Courses →
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Academic Progress
          </h3>
          <p className="text-gray-600 mb-4">
            Track your grades, attendance, and overall academic performance.
          </p>
          <Link
            to="/progress"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            View Progress →
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Schedule</h3>
          <p className="text-gray-600 mb-4">
            Check your class schedule, exams, and important academic dates.
          </p>
          <Link
            to="/schedule"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            View Schedule →
          </Link>
        </div>
      </div>
    </div>
  );
}
