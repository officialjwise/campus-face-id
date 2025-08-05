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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useColleges } from "@/hooks/useColleges";
import type { Department } from "@/types/api";

const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  college_id: z.string().min(1, "College is required"),
  description: z.string().optional(),
  department_head: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Department) => void;
  department?: Department;
  mode: "create" | "edit";
}

export function DepartmentModal({ isOpen, onClose, onSubmit, department, mode }: DepartmentModalProps) {
  const { data: colleges } = useColleges();
  
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      college_id: "",
      description: "",
      department_head: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (department && mode === "edit") {
      reset({
        name: department.name,
        college_id: department.college_id,
        description: department.description || "",
        department_head: department.department_head || "",
      });
    } else {
      reset({
        name: "",
        college_id: "",
        description: "",
        department_head: "",
      });
    }
  }, [department, mode, reset]);

  const handleSubmit = (data: DepartmentFormData) => {
    const departmentData: Department = {
      name: data.name,
      college_id: data.college_id,
      description: data.description,
      department_head: data.department_head,
      id: department?.id,
      created_at: department?.created_at || new Date().toISOString(),
    };
    onSubmit(departmentData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Department" : "Edit Department"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter department name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="college_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select college" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colleges?.map((college) => (
                          <SelectItem key={college.id} value={college.id}>
                            {college.name}
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="department_head"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Head (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department head name" {...field} />
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
                      placeholder="Enter department description"
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
                {mode === "create" ? "Add Department" : "Update Department"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}