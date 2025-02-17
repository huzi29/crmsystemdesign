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

const API_URL = "http://localhost:5050/api/v1/interaction";

const UpdateInteraction = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("x-access-token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { "x-access-token": token }),
  };

  const fetchInteractions = useCallback(async () => {
    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/getall`, {
        method: "GET",
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch interactions");

      const data = await response.json();
      setInteractions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    if (selectedInteraction) {
      reset({
        notes: selectedInteraction.notes || "",
        interactionType: selectedInteraction.interactionType || "",
      });
    }
  }, [selectedInteraction, reset]);

  const handleUpdate = async (data) => {
    if (!selectedInteraction) return;

    try {
      const response = await fetch(
        `${API_URL}/update/${selectedInteraction._id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to update interaction");

      setInteractions((prev) =>
        prev.map((interaction) =>
          interaction._id === selectedInteraction._id
            ? { ...interaction, ...data }
            : interaction
        )
      );
      setSelectedInteraction(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this interaction?")) return;

    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete interaction");

      setInteractions((prev) =>
        prev.filter((interaction) => interaction._id !== id)
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Interactions</h1>

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
                "Notes",
                "Interaction Type",
                "Handled By",
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
              : interactions.map((interaction) => (
                  <TableRow
                    key={interaction._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <TableCell className="px-4 py-3 border-r">
                      <p>{interaction.lead?.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">
                        {interaction.lead?.email || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {interaction.lead?.phone || "N/A"}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r">
                      {interaction.notes}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r">
                      {interaction.interactionType}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r">
                      {interaction.handledBy?.name || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 border-r text-center flex justify-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            onClick={() => setSelectedInteraction(interaction)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Edit Interaction</DialogTitle>
                          <form
                            onSubmit={handleSubmit(handleUpdate)}
                            className="space-y-6"
                          >
                            <div>
                              <Label>Notes</Label>
                              <Input type="text" {...register("notes")} />
                            </div>
                            <div>
                              <Label>Interaction Type</Label>
                              <Select
                                onValueChange={(value) =>
                                  setValue("interactionType", value)
                                }
                                defaultValue={
                                  selectedInteraction?.interactionType
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Call">Call</SelectItem>
                                  <SelectItem value="Meeting">
                                    Meeting
                                  </SelectItem>
                                  <SelectItem value="Email">Email</SelectItem>
                                  <SelectItem value="Site Visit">
                                    Site Visit
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
                        onClick={() => handleDelete(interaction._id)}
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

export default UpdateInteraction;
