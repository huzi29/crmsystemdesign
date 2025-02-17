"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const bookingSchema = z.object({
  leadId: z.string().min(1, "Lead is required"),
  property: z.string().min(1, "Property is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  tokenAmount: z.string().min(1, "Token amount is required"),
  handledBy: z.string().min(1, "Handler is required"),
  status: z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]),
});

const BookingForm = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    const token = localStorage.getItem("x-access-token");
    if (!token) {
      setErrorMessage("Unauthorized: No token found.");
      return;
    }

    const fetchLeads = async () => {
      try {
        const response = await fetch(
          "http://localhost:5050/api/v1/leads/getall",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch leads");

        const data = await response.json();
        setLeads(data);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5050/api/v1/auth/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch users");
        setUsers((await response.json()).data);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };

    fetchLeads();
    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch("http://localhost:5050/api/v1/booking/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("x-access-token"),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create booking");
      setSuccessMessage("Booking created successfully!");
      reset();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-6 space-y-4">
      <div className="w-full bg-white shadow-lg rounded-lg p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Submit Booking
        </h1>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="mb-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Lead</Label>
            <Select onValueChange={(value) => setValue("leadId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead._id} value={lead._id}>
                    {lead.name} ({lead.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Property</Label>
            <Input
              type="text"
              {...register("property")}
              placeholder="Enter property"
            />
          </div>
          <div className="flex col-span-2 gap-3 ">
            <Label className="mt-1">Booking Date</Label>
            <Input type="date" {...register("bookingDate")} />   
            <Label className="mt-1" >Token Amount</Label>
            <Input
              type="number"
              {...register("tokenAmount")}
              placeholder="Enter token amount"
            />
          </div>
          <div className="flex col-span-2 gap-3">
            <Label className="mt-1">Handled By</Label>
            <Select onValueChange={(value) => setValue("handledBy", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="mt-3">Status</Label>
            <Select onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Booking"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
