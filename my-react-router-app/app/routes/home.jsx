import { Link } from "react-router";

export function meta() {
  return [
    { title: "UserManager - Home" },
    { name: "description", content: "Welcome to UserManager - Manage your users beautifully!" },
  ];
}

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 bg-black/20 rounded-3xl backdrop-blur-sm border border-white/20 mb-12">
        <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            UserManager
          </span>
        </h1>
        <p className="text-xl text-white font-medium mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
          A beautiful and modern user management system built with React Router v7 and Tailwind CSS. 
          Manage your users with style and efficiency.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/users" 
            className="group bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center space-x-2 border border-white/20"
          >
            <span className="text-2xl">👥</span>
            <span>View All Users</span>
          </Link>
          
          <Link 
            to="/users/new" 
            className="group bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center space-x-2 border border-white/20"
          >
            <span className="text-2xl">➕</span>
            <span>Add New User</span>
          </Link>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/30 hover:bg-black/40 transition-all duration-300 transform hover:scale-105 shadow-xl">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Beautiful Design</h3>
          <p className="text-gray-200 font-medium">
            Modern glassmorphism design with beautiful gradients and smooth animations.
          </p>
        </div>
        
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/30 hover:bg-black/40 transition-all duration-300 transform hover:scale-105 shadow-xl">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Fast & Efficient</h3>
          <p className="text-gray-200 font-medium">
            Built with React Router v7 for lightning-fast navigation and optimal performance.
          </p>
        </div>
        
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/30 hover:bg-black/40 transition-all duration-300 transform hover:scale-105 shadow-xl">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Responsive</h3>
          <p className="text-gray-200 font-medium">
            Fully responsive design that works perfectly on all devices and screen sizes.
          </p>
        </div>
      </div>
    </div>
  );
}
