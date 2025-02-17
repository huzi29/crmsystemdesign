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

const enquirySchema = z.object({
  leadId: z.string().min(1, "Lead is required"),
  propertyInterest: z.string().min(3, "Property interest is required"),
  siteVisitDate: z.string().min(1, "Site visit date is required"),
});

const EnquiryForm = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [leads, setLeads] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(enquirySchema),
  });

  useEffect(() => {
    const token = localStorage.getItem("x-access-token");

    if (!token) {
      setErrorMessage("Unauthorized: No token found.");
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

        if (!response.ok) throw new Error("Failed to fetch leads");

        const data = await response.json();
        setLeads(data);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };

    fetchLeads();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5050/api/v1/enquiry/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("x-access-token"),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit enquiry");

      setSuccessMessage("Enquiry submitted successfully!");
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
        <h1 className="text-2xl font-bold text-gray-800">Submit Enquiry</h1>

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
            {errors.leadId && (
              <p className="text-red-500 text-sm">{errors.leadId.message}</p>
            )}
          </div>
          <div>
            <Label>Property Interest</Label>
            <Input
              type="text"
              {...register("propertyInterest")}
              placeholder="Enter property name"
            />
            {errors.propertyInterest && (
              <p className="text-red-500 text-sm">{errors.propertyInterest.message}</p>
            )}
          </div>
          <div>
            <Label>Site Visit Date</Label>
            <Input type="date" {...register("siteVisitDate")} />
            {errors.siteVisitDate && (
              <p className="text-red-500 text-sm">{errors.siteVisitDate.message}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Enquiry"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryForm;