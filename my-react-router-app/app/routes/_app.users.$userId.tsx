import { useLoaderData, Form, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { prisma } from "../lib/prisma";

// Define action function for handling form submission
export async function action({ request, params }: { request: Request; params: { userId: string } }) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const userId = parseInt(params.userId, 10); // Convert string ID to integer

  if (action === "delete") {
    try {
      // Delete user from the database
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to delete user:", error);
      const message = error instanceof Error ? error.message : String(error);
      return { error: message };
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
          id: userId,
        },
        data: {
          name,
          email,
          username,
          role,
        },
      });

    } catch (error) {
      console.error("Failed to update user:", error);
      const message = error instanceof Error ? error.message : String(error);
      return { error: message };
    }
  }

  return null;
}

// Define loader function to get user data
export async function loader({ params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId, 10); // Convert string ID to integer

  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Return the found user
    return { user };
  } catch (error) {
    console.error("Error loading user:", error);

    // Return error to be handled in the component
    const message = error instanceof Error ? error.message : String(error);
    return { error: message };
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-iu-red/20 blur-[120px] rounded-full" />
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-iu-red/30 rounded-none shadow-2xl p-8 max-w-md relative z-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-none bg-iu-red/10 mb-6 mx-auto border border-iu-red/30">
            <svg
              className="w-8 h-8 text-iu-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-center text-white mb-4 uppercase tracking-tighter">
            Error Loading User
          </h1>
          <p className="text-slate-400 text-center mb-6 font-bold">{error}</p>
          <div className="flex justify-center">
            <Link
              to="/users"
              className="inline-flex items-center px-6 py-3 border border-iu-blue text-sm font-black rounded-none shadow-sm text-white bg-iu-blue hover:bg-iu-blue/80 transition-all duration-200 uppercase tracking-widest"
            >
              Return to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-iu-blue/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-iu-purple/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <Link
            to="/users"
            className="inline-flex items-center text-iu-blue hover:text-iu-blue/80 font-black uppercase tracking-widest text-sm transition-colors"
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

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-none shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-slate-800 pb-8">
              <div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                  {isEditing ? "Edit User" : user.name || user.username}
                </h1>
                {!isEditing && (
                  <p className="text-iu-blue mt-1 font-bold tracking-wide">
                    {user.email}
                  </p>
                )}
              </div>

              {!isEditing && (
                <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-6 py-2 border border-slate-700 text-sm font-black rounded-none text-white bg-slate-800 hover:bg-slate-700 transition-all duration-200 uppercase tracking-widest"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>

                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center px-6 py-2 border border-iu-red text-sm font-black rounded-none text-white bg-iu-red hover:bg-iu-red/80 transition-all duration-200 uppercase tracking-widest"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <Form method="post" className="space-y-8">
                <input type="hidden" name="_action" value="update" />

                <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={user.name}
                      className="block w-full bg-slate-950 border border-slate-800 rounded-none px-4 py-3 text-white focus:ring-2 focus:ring-iu-blue focus:border-iu-blue transition-all font-bold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="username"
                      className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      defaultValue={user.username}
                      className="block w-full bg-slate-950 border border-slate-800 rounded-none px-4 py-3 text-white focus:ring-2 focus:ring-iu-blue focus:border-iu-blue transition-all font-bold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={user.email}
                      className="block w-full bg-slate-950 border border-slate-800 rounded-none px-4 py-3 text-white focus:ring-2 focus:ring-iu-blue focus:border-iu-blue transition-all font-bold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="role"
                      className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      defaultValue={user.role}
                      className="block w-full bg-slate-950 border border-slate-800 rounded-none px-4 py-3 text-white focus:ring-2 focus:ring-iu-blue focus:border-iu-blue transition-all font-bold appearance-none"
                    >
                      <option value="USER">User</option>
                      <option value="EDITOR">Editor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-slate-700 text-sm font-black rounded-none text-white bg-slate-800 hover:bg-slate-700 transition-all duration-200 uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 border border-iu-blue text-sm font-black rounded-none text-white bg-iu-blue hover:bg-iu-blue/80 transition-all duration-200 uppercase tracking-widest"
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            ) : (
              <div className="space-y-10">
                <div className="bg-slate-950/50 p-8 rounded-none border border-slate-800">
                  <h2 className="text-xl font-black text-white mb-8 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-8 bg-iu-blue mr-4"></span>
                    User Information
                  </h2>
                  <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Full Name
                      </dt>
                      <dd className="text-lg text-white font-bold">
                        {user.name || "—"}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Username
                      </dt>
                      <dd className="text-lg text-white font-bold">
                        {user.username}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Email Address
                      </dt>
                      <dd className="text-lg text-iu-blue font-bold">
                        {user.email}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Role
                      </dt>
                      <dd className="mt-1">
                        <span
                          className={`inline-flex items-center px-4 py-1 rounded-none text-xs font-black uppercase tracking-widest border ${
                            user.role === "ADMIN"
                              ? "bg-iu-red/10 text-iu-red border-iu-red/30"
                              : user.role === "EDITOR"
                                ? "bg-iu-orange/10 text-iu-orange border-iu-orange/30"
                                : "bg-iu-blue/10 text-iu-blue border-iu-blue/30"
                          }`}
                        >
                          {user.role === "ADMIN" && "👑 "}
                          {user.role === "EDITOR" && "✏️ "}
                          {user.role === "USER" && "👤 "}
                          {typeof user.role === "string"
                            ? user.role.toLowerCase()
                            : user.role}
                        </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        User ID
                      </dt>
                      <dd className="text-lg text-white font-bold font-mono">
                        {user.id}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                        Created At
                      </dt>
                      <dd className="text-lg text-white font-bold">
                        {new Date(user.createdAt).toLocaleDateString()}{" "}
                        <span className="text-slate-500 text-sm ml-2">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Delete confirmation modal */}
            {confirmDelete && (
              <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-slate-900 border border-iu-red/30 rounded-none shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
                  {/* Modal Glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-iu-red/10 blur-[60px] rounded-full" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 rounded-none bg-iu-red/10 mx-auto mb-6 border border-iu-red/30">
                      <svg
                        className="w-8 h-8 text-iu-red"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-white text-center mb-4 uppercase tracking-tighter">
                      Delete User
                    </h3>
                    <p className="text-slate-400 text-center mb-8 font-bold">
                      Are you sure you want to delete this user? This action
                      cannot be undone and all associated data will be lost.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="flex-1 px-6 py-3 border border-slate-700 text-sm font-black rounded-none text-white bg-slate-800 hover:bg-slate-700 transition-all duration-200 uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <Form
                        method="post"
                        onSubmit={handleDeleteSuccess}
                        className="flex-1"
                      >
                        <input type="hidden" name="_action" value="delete" />
                        <button
                          type="submit"
                          className="w-full px-6 py-3 border border-iu-red text-sm font-black rounded-none text-white bg-iu-red hover:bg-iu-red/80 transition-all duration-200 uppercase tracking-widest"
                        >
                          Delete
                        </button>
                      </Form>
                    </div>
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
