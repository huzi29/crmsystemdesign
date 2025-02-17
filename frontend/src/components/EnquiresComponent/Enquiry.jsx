"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("x-access-token");

    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    const fetchEnquiries = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/v1/enquiry/getall", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch enquiries: ${response.statusText}`);

        const data = await response.json();
        setEnquiries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Enquiries</h1>

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
              {["Name", "Email", "Phone", "Property Interest", "Site Visit Date", "Status"].map((header) => (
                <TableHead key={header} className="text-center font-semibold text-black border-r border-gray-200 last:border-none px-4 py-3">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-200">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j} className="px-4 py-2 border-r border-gray-200 last:border-none">
                        <Skeleton className="h-6 w-full rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : enquiries.map((enquiry) => (
                  <TableRow key={enquiry._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="px-4 py-3 border-r border-gray-200 last:border-none">{enquiry.lead?.name || "N/A"}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200 last:border-none">{enquiry.lead?.email || "N/A"}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200 last:border-none">{enquiry.lead?.phone || "N/A"}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200 last:border-none">{enquiry.propertyInterest}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200 last:border-none">{new Date(enquiry.siteVisitDate).toLocaleDateString()}</TableCell>
                    <TableCell
                      className={`px-4 py-3 border-r border-gray-200 last:border-none font-medium ${
                        enquiry.status === "Scheduled" ? "text-yellow-600" : "text-green-600"
                      }`}
                    >
                      {enquiry.status}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Enquiry;