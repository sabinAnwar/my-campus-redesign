import { useState } from "react";
import { useNavigate, Link, Form, redirect, useActionData } from "react-router-dom";
import { prisma } from "../lib/prisma";

// Action function to handle form submission
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  // Normalize FormDataEntryValue to strings to satisfy TypeScript and runtime checks
  const nameRaw = formData.get("name");
  const usernameRaw = formData.get("username");
  const emailRaw = formData.get("email");
  const roleRaw = formData.get("role");

  const name = typeof nameRaw === "string" ? nameRaw : "";
  const username = typeof usernameRaw === "string" ? usernameRaw : "";
  const email = typeof emailRaw === "string" ? emailRaw : "";
  const role = typeof roleRaw === "string" && roleRaw ? roleRaw : "USER";

  const userData = {
    name,
    username,
    email,
    role,
    createdAt: new Date()
  };

  // Basic validation
  const errors: Record<string, string> = {};
  if (!username) errors.username = "Username is required";
  if (!email) errors.email = "Email is required";
  if (email && !/\S+@\S+\.\S+/.test(email)) {
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
    
    // Safely extract message from unknown error
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Return database error
    return { 
      errors: { 
        _form: `Database error: ${errorMessage}` 
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
    const actionData = useActionData() as { errors?: Record<string, string>; values?: typeof formData } | null;
    const errors = actionData?.errors || {};
    const values = actionData?.values || formData;
  
  // Handle input changes
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/users"
            className="inline-flex items-center text-iu-blue hover:text-iu-blue/80 font-black uppercase tracking-widest text-sm"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Users
          </Link>
        </div>

        <div className="bg-slate-900 rounded-none border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-white tracking-tight">
                Add New User
              </h1>
              <p className="text-slate-400 mt-2 font-bold">
                Create a new user account
              </p>
            </div>

            {errors._form && (
              <div className="bg-iu-red/10 border-2 border-iu-red/50 text-iu-red px-4 py-3 rounded-none mb-6 font-black">
                <strong className="font-black">Error:</strong>
                <span className="block sm:inline"> {errors._form}</span>
              </div>
            )}

            <Form method="post" className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-black text-slate-300 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-iu-blue rounded-none transition-all font-bold ${errors.name ? "border-iu-red" : ""}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-iu-red font-black">
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="username"
                    className="block text-sm font-black text-slate-300 mb-2"
                  >
                    Username <span className="text-iu-red">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-iu-blue rounded-none transition-all font-bold ${errors.username ? "border-iu-red" : ""}`}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-iu-red font-black">
                        {errors.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-black text-slate-300 mb-2"
                  >
                    Email Address <span className="text-iu-red">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-0 focus:border-iu-blue rounded-none transition-all font-bold ${errors.email ? "border-iu-red" : ""}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-iu-red font-black">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-black text-slate-300 mb-2"
                  >
                    User Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 text-white focus:outline-none focus:ring-0 focus:border-iu-blue rounded-none transition-all font-bold"
                    >
                      <option value="USER">User</option>
                      <option value="EDITOR">Editor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate("/users")}
                    className="inline-flex items-center px-6 py-3 border-2 border-slate-700 text-sm font-black rounded-none text-slate-300 bg-transparent hover:bg-slate-800 hover:border-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border-2 border-iu-blue text-sm font-black rounded-none text-white bg-iu-blue hover:bg-iu-blue/90 transition-all shadow-lg hover:shadow-iu-blue/20"
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
