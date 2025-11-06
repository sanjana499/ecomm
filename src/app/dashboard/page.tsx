import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardPage() {
  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        {/* Main Dashboard Content */}
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">New Orders</p>
              <h3 className="text-2xl font-bold text-green-700 mt-2">0</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">Customers</p>
              <h3 className="text-2xl font-bold text-yellow-600 mt-2">0</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-pink-600 mt-2">$0</h3>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           
          </div>
        </main>
      </div>
    </div>
  );
}
