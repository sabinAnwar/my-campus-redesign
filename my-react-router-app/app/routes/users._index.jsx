import { useLoaderData, Link } from "react-router";
import React from "react";
import { prisma } from "../lib/prisma";

export async function loader() {
  try {
    // Get users from PostgreSQL database
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Loaded users from database:', users.length);
    
    return { users };
  } catch (error) {
    console.error('Database error:', error);
    
    // Fallback to mock data if database connection fails
    console.log('Using fallback mock data');
    const fallbackUsers = [
      {
        id: 1,
        email: 'john.doe@example.com',
        username: 'johndoe',
        name: 'John Doe',
        role: 'ADMIN',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        email: 'jane.smith@example.com',
        username: 'janesmith',
        name: 'Jane Smith',
        role: 'USER',
        createdAt: new Date('2024-02-20')
      }
    ];
    
    return { 
      users: fallbackUsers,
      databaseError: error.message
    };
  }
}

export default function Users() {
  const { users: serverUsers, databaseError } = useLoaderData();
  // State to store the users
  const [users, setUsers] = React.useState(serverUsers);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #eff6ff, #e0e7ff)" }}
    >
      <div className="container mx-auto px-4 py-8">
        {databaseError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong className="font-bold">Database Error:</strong>
            <span className="block sm:inline"> {databaseError}</span>
            <p className="mt-2">
              Using fallback data. Check your database connection.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-2">Manage your application users</p>
          </div>
          <Link to="new" className="btn-primary">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New User
          </Link>
        </div>

        {users.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div
              className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                background: "linear-gradient(135deg, #6366f1, #9333ea)",
              }}
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No users found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating your first user. You can add team members,
              administrators, or regular users to your application.
            </p>
            <div className="space-y-4">
              <Link to="new" className="btn-primary">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Your First User
              </Link>
              <div className="text-sm text-gray-500">
                <p>
                  �� Tip: You can create different types of users with various
                  roles.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Users grid
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Link
                to={`${user.id}`}
                key={user.id}
                className="group block transform transition-all duration-200 hover:scale-105"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 group-hover:border-indigo-300 transition-all duration-200">
                  <div className="flex items-center space-x-4 mb-4">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || user.username}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-indigo-200 transition-all duration-200"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center ring-4 ring-gray-100 group-hover:ring-indigo-200 transition-all duration-200"
                        style={{
                          background:
                            "linear-gradient(135deg, #6366f1, #9333ea)",
                        }}
                      >
                        <span className="text-2xl font-bold text-white">
                          {(user.name || user.username)[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
                        {user.name || user.username}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-800"
                          : user.role === "EDITOR"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "ADMIN" && "👑 "}
                      {user.role === "EDITOR" && "✏️ "}
                      {user.role === "USER" && "👤 "}
                      {typeof user.role === "string"
                        ? user.role.toLowerCase()
                        : user.role}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-indigo-600 group-hover:text-indigo-700 font-medium">
                      View Details
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats section when users exist */}
        {users.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter((u) => u.role === "ADMIN").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Regular Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter((u) => u.role === "USER").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
