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
  departments: z.array(z.string()).min(1, "At least one department is required"),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

interface College {
  id?: string;
  name: string;
  description?: string;
  departments: string[];
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
  const [newDepartment, setNewDepartment] = useState("");

  const form = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: "",
      description: "",
      departments: [],
    },
  });

  const { reset, watch, setValue } = form;
  const departments = watch("departments") || [];

  useEffect(() => {
    if (college && mode === "edit") {
      reset({
        name: college.name,
        description: college.description || "",
        departments: college.departments,
      });
    } else {
      reset({
        name: "",
        description: "",
        departments: [],
      });
    }
  }, [college, mode, reset]);

  const handleSubmit = (data: CollegeFormData) => {
    const collegeData: College = {
      name: data.name,
      description: data.description,
      departments: data.departments,
      id: college?.id,
      createdAt: college?.createdAt || new Date().toISOString().split('T')[0],
    };
    onSubmit(collegeData);
    onClose();
  };

  const addDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      setValue("departments", [...departments, newDepartment.trim()]);
      setNewDepartment("");
    }
  };

  const removeDepartment = (dept: string) => {
    setValue("departments", departments.filter(d => d !== dept));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDepartment();
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

            <div className="space-y-4">
              <FormLabel>Departments</FormLabel>
              
              {/* Add Department Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter department name"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDepartment}
                  disabled={!newDepartment.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Department Tags */}
              <div className="flex flex-wrap gap-2">
                {departments.map((dept, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>{dept}</span>
                    <button
                      type="button"
                      onClick={() => removeDepartment(dept)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {departments.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No departments added yet. Add at least one department.
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={departments.length === 0}>
                {mode === "create" ? "Add College" : "Update College"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}