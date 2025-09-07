import { useLoaderData, Form, useNavigate, Link } from "react-router";
import { useState } from "react";
import { prisma } from "../lib/prisma";

// Define action function for handling form submission
export async function action({ request, params }) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const userId = parseInt(params.userId, 10); // Convert string ID to integer

  if (action === "delete") {
    try {
      // Delete user from the database
      await prisma.user.delete({
        where: {
          id: userId
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error("Failed to delete user:", error);
      return { error: error.message };
    }
  } else if (action === "update") {
    const name = formData.get("name");
    const email = formData.get("email");
    const username = formData.get("username");
    const role = formData.get("role");
    
    try {
      // Update user in the database
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          name,
          email,
          username,
          role
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error("Failed to update user:", error);
      return { error: error.message };
    }
  }
  
  return null;
}

// Define loader function to get user data
export async function loader({ params }) {
  const userId = parseInt(params.userId, 10); // Convert string ID to integer
  
  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return { user };
  } catch (error) {
    console.error("Error loading user:", error);
    
    // Return error to be handled in the component
    return { error: error.message };
  }
}

export default function UserDetail() {
  const { user, error } = useLoaderData();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Handle successful delete
  const handleDeleteSuccess = () => {
    navigate("/users");
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)'}}>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6 mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">Error Loading User</h1>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <Link 
              to="/users"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)'}}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/users" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? "Edit User" : user.name || user.username}
                </h1>
                {!isEditing && (
                  <p className="text-gray-500 mt-1">{user.email}</p>
                )}
              </div>
              
              {!isEditing && (
                <div className="mt-4 md:mt-0 space-x-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <Form method="post" className="space-y-6">
                <input type="hidden" name="_action" value="update" />
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={user.name}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        defaultValue={user.username}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue={user.email}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <div className="mt-1">
                      <select
                        id="role"
                        name="role"
                        defaultValue={user.role}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="USER">User</option>
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            ) : (
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.name || '—'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN' 
                            ? 'bg-red-100 text-red-800' 
                            : user.role === 'EDITOR'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'ADMIN' && '��� '}
                          {user.role === 'EDITOR' && '✏️ '}
                          {user.role === 'USER' && '��� '}
                          {typeof user.role === 'string' ? user.role.toLowerCase() : user.role}
                        </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">User ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Created At</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                {/* Additional user information blocks can be added here */}
              </div>
            )}
            
            {/* Delete confirmation modal */}
            {confirmDelete && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete User</h3>
                  <p className="text-sm text-gray-500 text-center mb-6">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <Form method="post" onSubmit={handleDeleteSuccess}>
                      <input type="hidden" name="_action" value="delete" />
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
