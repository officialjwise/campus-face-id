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
import { X, Plus } from "lucide-react";

const collegeSchema = z.object({
  name: z.string().min(2, "College name must be at least 2 characters"),
  description: z.string().optional(),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

interface College {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
}

interface CollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: College) => void;
  college?: College;
  mode: "create" | "edit";
}

export function CollegeModal({ isOpen, onClose, onSubmit, college, mode }: CollegeModalProps) {
  const form = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (college && mode === "edit") {
      reset({
        name: college.name,
        description: college.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [college, mode, reset]);

  const handleSubmit = (data: CollegeFormData) => {
    const collegeData: College = {
      name: data.name,
      description: data.description,
      id: college?.id,
      createdAt: college?.createdAt || new Date().toISOString().split('T')[0],
    };
    onSubmit(collegeData);
    onClose();
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
              <Button type="submit">
                {mode === "create" ? "Add College" : "Update College"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}