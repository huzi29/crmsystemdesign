"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("x-access-token");

    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/v1/booking/getall", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch bookings: ${response.statusText}`);

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md bg-white">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-300 border-b border-gray-300">
              {["Name", "Email", "Phone", "Property", "Token AMT", "Handled By", "Status", "Booking Date"].map((header) => (
                <TableHead key={header} className="text-center font-semibold text-black border-r border-gray-200 px-4 py-3">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-200">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j} className="px-4 py-2 border-r border-gray-200 last:border-none">
                        <Skeleton className="h-6 w-full rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : bookings.map((booking) => (
                  <TableRow key={booking._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="px-4 py-3 border-r border-gray-200">{booking.lead?.name || "N/A"}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200">{booking.lead?.email || "N/A"}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200">{booking.lead?.phone || "N/A"}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200">{booking.property}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200 text-green-600 text-center font-medium">₹{booking.tokenAmount}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200">{booking.handledBy?.name || "N/A"}</TableCell>
                    <TableCell
                      className={`px-4 py-3 border-r border-gray-200 font-medium ${
                        booking.status === "Pending" ? "text-yellow-600" : "text-green-600"
                      }`}
                    >
                      {booking.status}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200">{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Booking;