"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("x-access-token");

    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    const fetchLeads = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/v1/leads/getall", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch leads: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setLeads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Leads</h1>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-300 border-b border-gray-300">
              {["Name", "Email", "Phone", "Source", "Status", "Interactions"].map((header) => (
                <TableHead key={header} className="text-center font-semibold text-black border-r border-gray-200 px-4 py-3">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j} className="px-4 py-3 border-r border-gray-300">
                        <Skeleton className="h-6 w-full rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : leads.map((lead) => (
                  <TableRow key={lead._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="px-4 py-3 border-r border-gray-200">{lead.name}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200">{lead.email}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200">{lead.phone}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200">{lead.source}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200 font-medium">{lead.status}</TableCell>
                    <TableCell className="px-4 py-3 border-r border-gray-200">
                      {lead.interactions.length > 0 ? (
                        <ul className="list-disc list-inside text-left">
                          {lead.interactions.map((interaction) => (
                            <li key={interaction._id} className="text-sm">
                              {interaction.interactionType}: {interaction.notes} (By: {interaction.handledBy?.name})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No Interactions"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default LeadsPage;