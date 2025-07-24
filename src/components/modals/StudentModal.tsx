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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colleges, getDepartmentsByCollege } from "@/data/colleges";
import { Camera, Upload } from "lucide-react";

const studentSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  studentId: z.string().min(3, "Student ID is required"),
  indexNumber: z.string().min(3, "Index number is required"),
  email: z.string().email("Invalid email address"),
  college: z.string().min(1, "College is required"),
  department: z.string().min(1, "Department is required"),
  profileImage: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface Student {
  id?: string;
  fullName: string;
  studentId: string;
  indexNumber: string;
  email: string;
  college: string;
  department: string;
  profileImage?: string;
  registrationDate?: string;
  status?: "active" | "inactive";
}

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Student) => void;
  student?: Student;
  mode: "create" | "edit";
}

export function StudentModal({ isOpen, onClose, onSubmit, student, mode }: StudentModalProps) {
  const [selectedCollege, setSelectedCollege] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      studentId: "",
      indexNumber: "",
      email: "",
      college: "",
      department: "",
      profileImage: "",
    },
  });

  const { reset, watch, setValue } = form;
  const watchedCollege = watch("college");

  useEffect(() => {
    if (student && mode === "edit") {
      reset({
        fullName: student.fullName,
        studentId: student.studentId,
        indexNumber: student.indexNumber,
        email: student.email,
        college: student.college,
        department: student.department,
        profileImage: student.profileImage || "",
      });
      setSelectedCollege(student.college);
      setPreviewImage(student.profileImage || "");
    } else {
      reset({
        fullName: "",
        studentId: "",
        indexNumber: "",
        email: "",
        college: "",
        department: "",
        profileImage: "",
      });
      setSelectedCollege("");
      setPreviewImage("");
    }
  }, [student, mode, reset]);

  useEffect(() => {
    if (watchedCollege) {
      const collegeDepartments = getDepartmentsByCollege(watchedCollege);
      setDepartments(collegeDepartments);
      if (!collegeDepartments.includes(watch("department"))) {
        setValue("department", "");
      }
    }
  }, [watchedCollege, setValue, watch]);

  const handleSubmit = (data: StudentFormData) => {
    const studentData: Student = {
      fullName: data.fullName,
      studentId: data.studentId,
      indexNumber: data.indexNumber,
      email: data.email,
      college: data.college,
      department: data.department,
      profileImage: previewImage,
      id: student?.id,
      registrationDate: student?.registrationDate || new Date().toISOString().split('T')[0],
      status: student?.status || "active",
    };
    onSubmit(studentData);
    onClose();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setValue("profileImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRandomProfileImage = () => {
    const images = [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1494790108755-2616b6f6d16b?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setPreviewImage(randomImage);
    setValue("profileImage", randomImage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Student" : "Edit Student"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewImage} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Camera className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getRandomProfileImage}
                >
                  Random Photo
                </Button>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="STU001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="indexNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Index Number</FormLabel>
                    <FormControl>
                      <Input placeholder="IND2024001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="student@university.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="college"
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
                        {colleges.map((college) => (
                          <SelectItem key={college.name} value={college.name}>
                            {college.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Add Student" : "Update Student"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}