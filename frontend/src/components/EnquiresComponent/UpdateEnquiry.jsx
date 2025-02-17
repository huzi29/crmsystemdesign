"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash } from "lucide-react";

const API_URL = "http://localhost:5050/api/v1/enquiry";

const UpdateEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("x-access-token")
      : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "x-access-token": token }),
  };


  const fetchEnquiries = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/getall`, {
        method: "GET",
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch enquiries");
      const data = await response.json();

      setEnquiries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
  }, [enquiries]);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const { register, handleSubmit, setValue, reset, watch } = useForm();

  useEffect(() => {
    if (selectedEnquiry) {
      reset({
        propertyInterest: selectedEnquiry.propertyInterest || "",
        siteVisitDate: selectedEnquiry.siteVisitDate?.split("T")[0] || "",
        status: selectedEnquiry.status || "Scheduled",
      });
    }
  }, [selectedEnquiry, reset]);

  const handleUpdate = async (data) => {
    if (!selectedEnquiry) return;

    try {
      const response = await fetch(`${API_URL}/update/${selectedEnquiry._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          propertyInterest: data.propertyInterest,
          siteVisitDate: data.siteVisitDate,
          status: data.status,
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Failed to update enquiry: ${errorMsg}`);
      }

      fetchEnquiries();

      setSelectedEnquiry(null);
      reset();
    } catch (error) {
      console.error("Update error:", error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) throw new Error("Failed to delete enquiry");

      setEnquiries((prev) => prev.filter((enquiry) => enquiry._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Enquiries</h1>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="overflow-x-auto border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-300">
              {[
                "Name",
                "Property Interest",
                "Site Visit Date",
                "Status",
                "Actions",
              ].map((header) => (
                <TableHead
                  key={header}
                  className="px-4 py-3 text-center text-black font-semibold border-r"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : enquiries.map((enquiry) => (
                  <TableRow
                    key={enquiry._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="px-4 py-3 border-r">
                      <p>{enquiry.lead?.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">
                        {enquiry.lead?.email || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {enquiry.lead?.phone || "N/A"}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r">
                      {enquiry.propertyInterest}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r">
                      {new Date(enquiry.siteVisitDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r ">
                      {enquiry.status}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r text-center flex justify-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            // size="icon"
                            onClick={() => setSelectedEnquiry(enquiry)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Edit Enquiry</DialogTitle>
                          <form
                            onSubmit={handleSubmit(handleUpdate)}
                            className="space-y-6"
                          >
                            <div>
                              <Label>Property Interest</Label>
                              <Input
                                type="text"
                                {...register("propertyInterest")}
                              />
                            </div>
                            <div>
                              <Label>Site Visit Date</Label>
                              <Input
                                type="date"
                                {...register("siteVisitDate")}
                              />
                            </div>
                            <div>
                              <Label>Status</Label>
                              <Select
                                value={watch("status")}
                                onValueChange={(value) =>
                                  setValue("status", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Scheduled">
                                    Scheduled
                                  </SelectItem>
                                  <SelectItem value="Completed">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button type="submit" className="w-full">
                              Update
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(enquiry._id)}
                      >
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

export default UpdateEnquiry;
