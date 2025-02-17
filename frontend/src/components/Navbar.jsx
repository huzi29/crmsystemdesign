"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh-token");

    if (!refreshToken) {
      alert("No refresh token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/api/v1/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.removeItem("x-access-token");
        localStorage.removeItem("refresh-token");
        router.push("/");
      } else {
        alert(result.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-64 w-[calc(100%-16rem)] z-10">
      <div className="text-lg font-semibold">CRM System</div>
      <div className="flex items-center space-x-4">
        <button onClick={handleLogout} className="flex items-center gap-2 p-2 bg-red-600 rounded-md hover:bg-red-700 transition">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
