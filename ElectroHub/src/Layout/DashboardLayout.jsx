import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { FaBars, FaHome, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { 
  FaBox, 
  FaTable, 
  FaCommentAlt, 
  FaCreditCard, 
  FaShoppingCart,
  FaUsers,
  FaPlusCircle
} from "react-icons/fa";
import useRole from "../Hooks/useRole";
// import { useAuth } from "../contexts/AuthContext";
// import { useEffect } from "react";
// import useAuth from "../Hooks/useAuth";

const DashboardLayout = () => {
  const [role, isLoading] = useRole();
  // const { logout } = useAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoading && !role) {
  //     navigate("/login");
  //   }
  // }, [role, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
      isActive 
        ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md" 
        : "text-gray-700 hover:bg-gray-100 hover:text-primary hover:shadow-sm"
    }`;

  // Navigation configuration by role
  const navigationConfig = {
    user: [
      { path: "/dashboard/user", label: "Dashboard", icon: <MdDashboard className="text-lg" /> },
      { path: "/UserCard", label: "My Cards", icon: <FaCreditCard className="text-lg" /> },
      { path: "/Orders", label: "My Orders", icon: <FaShoppingCart className="text-lg" /> },
    ],
    creator: [
      { path: "/dashboard/creator", label: "Overview", icon: <MdDashboard className="text-lg" /> },
      { path: "/dashboard/AddProducts", label: "Add Product", icon: <FaPlusCircle className="text-lg" /> },
      { path: "/dashboard/ProductsTable", label: "My Products", icon: <FaTable className="text-lg" /> },
      { path: "/dashboard/SeeAllReviews", label: "Reviews", icon: <FaCommentAlt className="text-lg" /> },
      { path: "/dashboard/MyCards", label: "My Cards", icon: <FaCreditCard className="text-lg" /> },
      { path: "/dashboard/AllOrders", label: "All Orders", icon: <FaShoppingCart className="text-lg" /> },
    ],
    admin: [
      { path: "/dashboard/admin", label: "Admin Panel", icon: <MdDashboard className="text-lg" /> },
      { path: "/dashboard/ProductsTable", label: "All Products", icon: <FaBox className="text-lg" /> },
      { path: "/dashboard/AddProducts", label: "Add Product", icon: <FaPlusCircle className="text-lg" /> },
      { path: "/dashboard/SeeAllReviews", label: "Reviews", icon: <FaCommentAlt className="text-lg" /> },
      { path: "/dashboard/AllOrders", label: "All Orders", icon: <FaShoppingCart className="text-lg" /> },
      { path: "/dashboard/MyCards", label: "My Cards", icon: <FaCreditCard className="text-lg" /> },
      // { path: "/dashboard/users", label: "User Management", icon: <FaUsers className="text-lg" /> },
    ],
  };

  // const handleLogout = async () => {
  //   await logout();
  //   navigate("/login");
  // };

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main Content Area */}
      <div className="drawer-content flex flex-col min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="navbar px-6">
            <div className="flex items-center gap-4">
              <label 
                htmlFor="dashboard-drawer" 
                className="btn btn-ghost btn-square lg:hidden"
                aria-label="Open menu"
              >
                <FaBars className="text-xl" />
              </label>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Electro Hub</h1>
                  <p className="text-xs text-gray-500 capitalize">
                    {role ? `${role} Dashboard` : "Loading..."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* <div className="navbar-end">
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm text-gray-600 hover:text-error hover:bg-error/10"
                aria-label="Logout"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div> */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" aria-label="Close menu"></label>
        <aside className="menu p-6 w-80 bg-white border-r border-gray-200 min-h-full shadow-lg">
          {/* Sidebar Header */}
          <div className="mb-8 pt-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">EH</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Electro Hub</h2>
                <p className="text-xs text-gray-500">Dashboard Navigation</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {/* Home Link */}
            <div className="mb-4">
              <Link
                to="/"
                className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors group"
              >
                <FaHome className="text-lg opacity-70 group-hover:opacity-100" />
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>

            {/* Role-based Navigation */}
            <ul className="space-y-1">
              {navigationConfig[role]?.map((item) => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path} 
                    className={navLinkClass}
                    end={item.path === "/dashboard/user" || item.path === "/dashboard/creator" || item.path === "/dashboard/admin"}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Logout in Sidebar (mobile visible) */}
            {/* <div className="pt-8 mt-8 border-t border-gray-200 lg:hidden">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full py-3 px-4 rounded-lg text-gray-700 hover:bg-error/10 hover:text-error transition-colors"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Logout</span>
              </button>
            </div> */}

            {/* Current Role Badge */}
            <div className="pt-8 mt-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Current Role</p>
                <p className="text-lg font-semibold text-primary capitalize mt-1">{role}</p>
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;