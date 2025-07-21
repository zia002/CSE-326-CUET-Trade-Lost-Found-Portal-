import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetSignedInUserQuery } from "../redux/features/auth/authApi";
import { getBaseURL } from "../utils/baseURL";

const Dashboard = () => {
  const { data: user, isLoading, isError } = useGetSignedInUserQuery();
  const [stats, setStats] = useState(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${getBaseURL()}/api/auth/stats`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          console.error("Failed to fetch stats:", data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (isAdmin) fetchStats();
  }, [user]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-600">
          Loading your dashboard...
        </div>
      </div>
    );
  if (isError || !user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">Failed to load dashboard.</div>
      </div>
    );

  return (
    <section className="py-12 min-h-screen ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {isAdmin ? (
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            ) : (
              <>
                Welcome back,{" "}
                <span className="text-blue-600">{user.fullName}</span>
              </>
            )}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {isAdmin
              ? "Overview of platform performance and admin tools"
              : "Everything you need to manage your account in one place"}
          </p>
        </div>

        {/* Admin Stats */}
        {isAdmin && stats && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Platform Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Total Users"
                value={stats.totalUsers}
                icon="👥"
                color="from-purple-500 to-indigo-500"
              />
              <StatCard
                label="Products Listed"
                value={stats.totalProducts}
                icon="📦"
                color="from-blue-500 to-teal-500"
              />
              <StatCard
                label="Active Bids"
                value={stats.totalBids}
                icon="💰"
                color="from-green-500 to-emerald-500"
              />
              <StatCard
                label="Lost/Found Posts"
                value={stats.lostFoundPosts}
                icon="🔍"
                color="from-amber-500 to-orange-500"
              />
            </div>
          </div>
        )}

        {/* Admin Tools */}
        {isAdmin && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Admin Tools
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <DashboardCard
                to="/admin/users"
                title="Manage Users"
                description="View all users, manage roles, and account status"
                icon="👥"
                gradient="bg-gradient-to-br from-purple-50 to-indigo-50"
              />
              <DashboardCard
                to="/admin/products"
                title="Manage Products"
                description="Approve or remove listed products"
                icon="📦"
                gradient="bg-gradient-to-br from-blue-50 to-teal-50"
              />
            </div>
          </div>
        )}

        {/* User Tools */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            My Dashboard
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              to="/dashboard/listings"
              title="My Listings"
              description="Manage your uploaded products"
              icon="🧾"
              gradient="bg-gradient-to-br from-green-50 to-emerald-50"
            />
            <DashboardCard
              to="/dashboard/bids"
              title="My Bids"
              description="Track your bids and purchases"
              icon="📈"
              gradient="bg-gradient-to-br from-amber-50 to-orange-50"
            />
            <DashboardCard
              to="/dashboard/orders"
              title="Manage All Orders"
              description="View and manage your orders"
              icon="🛒"
              gradient="bg-gradient-to-br from-red-50 to-pink-50"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1`}
  >
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div
          className={`text-3xl bg-gradient-to-r ${color} rounded-lg p-3 text-white`}
        >
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const DashboardCard = ({ to, title, description, icon, gradient }) => (
  <Link to={to} className="group">
    <div
      className={`${gradient} rounded-xl p-6 h-full border border-gray-100 transition-all group-hover:shadow-md group-hover:-translate-y-1`}
    >
      <div className="flex items-start">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default Dashboard;
