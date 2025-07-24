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
import PhotoModal from "@/components/PhotoModal";

const studentSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must be less than 30 characters")
    .regex(/^[a-zA-Z]+$/, "First name can only contain letters"),
  middleName: z.string()
    .max(30, "Middle name must be less than 30 characters")
    .regex(/^[a-zA-Z]*$/, "Middle name can only contain letters")
    .optional(),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must be less than 30 characters")
    .regex(/^[a-zA-Z]+$/, "Last name can only contain letters"),
  studentId: z.string()
    .length(8, "Student ID must be exactly 8 characters")
    .regex(/^[A-Z0-9]{8}$/, "Student ID can only contain uppercase letters and numbers"),
  indexNumber: z.string()
    .length(7, "Index number must be exactly 7 characters")
    .regex(/^[A-Z0-9]{7}$/, "Index number can only contain uppercase letters and numbers"),
  email: z.string()
    .email("Invalid email address")
    .max(100, "Email must be less than 100 characters"),
  college: z.string().min(1, "College is required"),
  department: z.string().min(1, "Department is required"),
  profileImage: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface Student {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
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
  const [showCamera, setShowCamera] = useState(false);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
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
        firstName: student.firstName,
        middleName: student.middleName || "",
        lastName: student.lastName,
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
        firstName: "",
        middleName: "",
        lastName: "",
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
    const fullName = [data.firstName, data.middleName, data.lastName]
      .filter(Boolean)
      .join(' ');
    
    const studentData: Student = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      fullName: fullName,
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

  const handleCameraCapture = (imageData: string) => {
    setPreviewImage(imageData);
    setValue("profileImage", imageData);
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
                  onClick={() => setShowCamera(true)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter middle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID (8 characters)</FormLabel>
                    <FormControl>
                      <Input placeholder="STU12345" maxLength={8} {...field} />
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
                    <FormLabel>Index Number (7 characters)</FormLabel>
                    <FormControl>
                      <Input placeholder="IND2401" maxLength={7} {...field} />
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
                  <FormItem className="md:col-span-2">
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

        <PhotoModal
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={handleCameraCapture}
        />
      </DialogContent>
    </Dialog>
  );
}