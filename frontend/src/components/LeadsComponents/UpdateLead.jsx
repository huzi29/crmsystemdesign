"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash } from "lucide-react";

const API_URL = "http://localhost:5050/api/v1/leads";

const UpdateLead = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const token = localStorage.getItem("x-access-token");
  const headers = { "Content-Type": "application/json", "x-access-token": token };

  const fetchLeads = useCallback(async () => {
    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/getall`, { method: "GET", headers });
      if (!response.ok) throw new Error(`Failed to fetch leads: ${response.statusText}`);
      setLeads(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    if (selectedLead) reset(selectedLead);
  }, [selectedLead, reset]);

  const handleUpdate = async (data) => {
    if (!token) return console.error("Unauthorized: No token found.");
    try {
      const response = await fetch(`${API_URL}/update/${selectedLead._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update lead");

      setLeads((prev) =>
        prev.map((lead) => (lead._id === selectedLead._id ? { ...lead, ...data } : lead))
      );
      setSelectedLead(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return console.error("Unauthorized: No token found.");
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) throw new Error("Failed to delete lead");

      setLeads((prev) => prev.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

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
              {["Name", "Email", "Phone", "Source", "Status", "Actions"].map((header) => (
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
                    {Array.from({ length: 6 }).map((_, j) => (
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
                    <TableCell className="px-4 py-3 border-r border-gray-200 text-center flex justify-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" onClick={() => setSelectedLead(lead)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Edit Lead</DialogTitle>
                          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
                            <div>
                              <Label>Name</Label>
                              <Input type="text" {...register("name")} />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input type="email" {...register("email")} />
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <Input type="text" {...register("phone")} />
                            </div>
                            <div>
                              <Label>Source</Label>
                              <Select onValueChange={(value) => setValue("source", value)} defaultValue={selectedLead?.source}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Website">Website</SelectItem>
                                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                  <SelectItem value="Facebook">Facebook</SelectItem>
                                  <SelectItem value="Instagram">Instagram</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select onValueChange={(value) => setValue("status", value)} defaultValue={selectedLead?.status}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="New">New</SelectItem>
                                  <SelectItem value="Contacted">Contacted</SelectItem>
                                  <SelectItem value="Interested">Interested</SelectItem>
                                  <SelectItem value="Converted">Converted</SelectItem>
                                  <SelectItem value="Lost">Lost</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button type="submit">Update Lead</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(lead._id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UpdateLead;
