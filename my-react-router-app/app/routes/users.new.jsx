import { useState } from "react";
import { useNavigate, Link, Form, redirect } from "react-router";
import { prisma } from "../lib/prisma";

// Action function to handle form submission
export async function action({ request }) {
  const formData = await request.formData();
  const userData = {
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    role: formData.get("role") || "USER",
    createdAt: new Date()
  };

  // Basic validation
  const errors = {};
  if (!userData.username) errors.username = "Username is required";
  if (!userData.email) errors.email = "Email is required";
  if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
    errors.email = "Email is invalid";
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return { errors, values: userData };
  }

  try {
    // Create user in the database
    const newUser = await prisma.user.create({
      data: userData
    });
    
    console.log("User created:", newUser);
    
    // Redirect to the user list page after successful creation
    return redirect("/users");
  } catch (error) {
    console.error("Error creating user:", error);
    
    // Return database error
    return { 
      errors: { 
        _form: `Database error: ${error.message}` 
      },
      values: userData
    };
  }
}

export const loader = async () => {
  return null;
};

export default function NewUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "USER"
  });
  
  // This will be populated by the form action if there are errors
  const actionData = {};
  const errors = actionData?.errors || {};
  const values = actionData?.values || formData;
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
              <p className="text-gray-600 mt-2">Create a new user account</p>
            </div>
            
            {errors._form && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {errors._form}</span>
              </div>
            )}
            
            <Form method="post" className="space-y-6">
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
                      value={formData.name}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.username ? 'border-red-300' : ''}`}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.email ? 'border-red-300' : ''}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    User Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="USER">User</option>
                      <option value="EDITOR">Editor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate("/users")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create User
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
