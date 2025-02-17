import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
    <Sidebar />
    <div className="flex-1 ml-64 min-h-screen bg-gray-100">
      <Navbar />
      <div className="mt-16 p-6">{children}</div>
    </div>
  </div>
  );
}

export default DashboardLayout;