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
import { Pencil, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const API_URL = "http://localhost:5050/api/v1/booking";

const UpdateBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("x-access-token")
      : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "x-access-token": token }),
  };

  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/getall`, {
        method: "GET",
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const { register, handleSubmit, setValue, reset, watch } = useForm();

  useEffect(() => {
    if (selectedBooking) {
      reset({
        property: selectedBooking.property || "",
        tokenAmount: selectedBooking.tokenAmount || "",
        // handledBy: selectedBooking.handledBy || "",
        bookingDate: selectedBooking.bookingDate?.split("T")[0] || "",
        status: selectedBooking.status || "Pending",
      });
    }
  }, [selectedBooking, reset]);

  const handleUpdate = async (data) => {
    if (!selectedBooking) return;
    try {
      const response = await fetch(`${API_URL}/update/${selectedBooking._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update booking");
      fetchBookings();
      setSelectedBooking(null);
      reset();
    } catch (error) {
      console.error("Update error:", error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete booking");
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Bookings</h1>
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
                "Property",
                "Token Amount",
                "Booking Date",
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
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : bookings.map((booking) => (
                  <TableRow
                    key={booking._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="px-4 py-3 border-r">
                      <p>{booking.lead?.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">
                        {booking.lead?.email || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.lead?.phone || "N/A"}
                      </p>
                      </TableCell>
                    <TableCell className="px-4 py-3 border-r">
                      {booking.property}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r">
                      {booking.tokenAmount}
                    </TableCell>

                    <TableCell className="px-4 py-3 border-r">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r">
                      {booking.status}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r text-center flex justify-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedBooking(booking)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Edit Booking</DialogTitle>
                          <form
                            onSubmit={handleSubmit(handleUpdate)}
                            className="space-y-6"
                          >
                            <div>
                              <Label>Property</Label>
                              <Input type="text" {...register("property")} />
                            </div>
                            <div>
                              <Label>Token Amount</Label>
                              <Input
                                type="number"
                                {...register("tokenAmount")}
                              />
                            </div>
                            <div>
                              <Label>Handled By</Label>
                              <Input type="text" {...register("handledBy")} />
                            </div>
                            <div>
                              <Label>Booking Date</Label>
                              <Input type="date" {...register("bookingDate")} />
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
                                  <SelectItem value="Pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="Confirmed">
                                    Confirmed
                                  </SelectItem>
                                  <SelectItem value="Cancelled">
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>                            </div>
                            <Button type="submit" className="w-full">
                              Update
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(booking._id)}
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

export default UpdateBooking;
