import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import { useCreateCollege, useUpdateCollege } from "@/hooks/useColleges";
import { useToast } from "@/hooks/use-toast";
import type { College } from "@/types/api";

const collegeSchema = z.object({
  name: z.string().min(2, "College name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  description: z.string().optional(),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

interface CollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  college?: College;
  mode: "create" | "edit";
}

export function CollegeModal({ isOpen, onClose, college, mode }: CollegeModalProps) {
  const { toast } = useToast();
  const createCollege = useCreateCollege();
  const updateCollege = useUpdateCollege();

  const form = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (college && mode === "edit") {
      reset({
        name: college.name,
        location: college.location || "",
        description: college.description || "",
      });
    } else {
      reset({
        name: "",
        location: "",
        description: "",
      });
    }
  }, [college, mode, reset]);

  const handleSubmit = (data: CollegeFormData) => {
    // Ensure required fields are present
    const createData = {
      name: data.name,
      location: data.location,
      description: data.description,
    };

    if (mode === "create") {
      createCollege.mutate(createData, {
        onSuccess: () => {
          toast({
            title: "College created",
            description: `${data.name} has been added successfully.`,
          });
          onClose();
          form.reset();
        },
        onError: (error) => {
          toast({
            title: "Failed to create college",
            description: error.message || "An error occurred",
            variant: "destructive",
          });
        },
      });
    } else if (college?.id) {
      updateCollege.mutate({ id: college.id, data: createData }, {
        onSuccess: () => {
          toast({
            title: "College updated",
            description: `${data.name} has been updated successfully.`,
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Failed to update college",
            description: error.message || "An error occurred",
            variant: "destructive",
          });
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New College" : "Edit College"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter college name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter college location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter college description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createCollege.isPending || updateCollege.isPending}
              >
                {(createCollege.isPending || updateCollege.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {mode === "create" ? "Add College" : "Update College"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}