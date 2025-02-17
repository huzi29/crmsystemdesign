"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const leadSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  source: z.enum(["Website", "LinkedIn", "Facebook", "Instagram", "Other"]),
  status: z.enum(["New", "Contacted", "Interested", "Converted", "Lost"]).optional(),
});

const LeadForm = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: { status: "New" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("x-access-token");
    if (!token) {
      setErrorMessage("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/api/v1/leads/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to add lead: ${response.statusText}`);
      }

      setSuccessMessage("Lead added successfully!");
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
      <h1 className="text-2xl font-bold text-gray-800">Add Leads</h1>

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
            <Label>Name</Label>
            <Input type="text" {...register("name")} placeholder="Enter name" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" {...register("email")} placeholder="Enter email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="flex col-span-3 gap-3">
            <Label className="mt-3">Phone</Label>
            <Input type="text" {...register("phone")} placeholder="Enter phone number" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

            <Label className="mt-3">Source</Label>
            <Select onValueChange={(value) => setValue("source", value)} defaultValue="Other">
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
            {errors.source && <p className="text-red-500 text-sm">{errors.source.message}</p>}

            <Label className="mt-3">Status</Label>
            <Select onValueChange={(value) => setValue("status", value)} defaultValue="New">
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
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Lead"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LeadForm;