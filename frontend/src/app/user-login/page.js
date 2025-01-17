"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const page = () => {
  const router = useRouter();

  // Validation schema for Sign-Up
  const registerSchema = yup.object().shape({
    username: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    dateOfBirth: yup.date().required("Birth date is required"),
    gender: yup
      .string()
      .oneOf(["male", "female", "other"], "Please select a gender")
      .required("Gender is required"),
    studentId: yup
      .string()
      .required("Student ID is required"),
    department: yup.string().required("Department is required"),
    isAlumni: yup.string().required("Please select if you are a student or alumni"),
    batch: yup.string().when("isAlumni", {
      is: "alumni",
      then: yup.string().required("Batch is required for alumni"),
    }),
    graduationYear: yup.string().when("isAlumni", {
      is: "alumni",
      then: yup.string().required("Graduation year is required for alumni"),
    }),
  });
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLoginForm,
    formState: { errors: errorsLogin },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUpForm,
    formState: { errors: errorsSignUp },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const [isAlumni, setIsAlumni] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-900 flex items-center justify-center p-2 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md dark:text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              <span>CUETbook</span>
            </CardTitle>
            <CardDescription className="text-center">
              Connect with CUETians around the campus and the world!
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loginEmail">Email</Label>
                      <Input
                        id="loginEmail"
                        name="email"
                        type="email"
                        {...registerLogin("email")}
                        placeholder="Enter your email"
                        className="col-span-3 dark:border-gray-400"
                      />
                      {errorsLogin.email && (
                        <p className="text-red-500">
                          {errorsLogin.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loginPassword">Password</Label>
                      <Input
                        id="loginPassword"
                        name="password"
                        type="password"
                        {...registerLogin("password")}
                        placeholder="Enter your Password"
                        className="col-span-3 dark:border-gray-400"
                      />
                      {errorsLogin.password && (
                        <p className="text-red-500">
                          {errorsLogin.password.message}
                        </p>
                      )}
                    </div>
                    <Button className="w-full" type="submit">
                      <LogIn className="mr-2 w-4 h-4" /> Log in
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-500">
  <form>
    <div className="grid grid-cols-2 gap-6">
      {/* Column 1 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signupName">Username</Label>
          <Input
            id="signupName"
            name="username"
            type="text"
            {...registerSignUp("username")}
            placeholder="Enter your username"
            className="col-span-3 dark:border-gray-400"
          />
          {errorsSignUp.username && (
            <p className="text-red-500">{errorsSignUp.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signupGender">Gender</Label>
          <select
            id="signupGender"
            name="gender"
            {...registerSignUp("gender")}
            className="w-full border dark:border-gray-400 rounded-md px-3 py-2"
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errorsSignUp.gender && (
            <p className="text-red-500">{errorsSignUp.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signupEmail">Email</Label>
          <Input
            id="signupEmail"
            name="email"
            type="email"
            {...registerSignUp("email")}
            placeholder="Enter your email"
            className="col-span-3 dark:border-gray-400"
          />
          {errorsSignUp.email && (
            <p className="text-red-500">{errorsSignUp.email.message}</p>
          )}
        </div>
      </div>

      {/* Column 2 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signupPassword">Password</Label>
          <Input
            id="signupPassword"
            name="password"
            type="password"
            {...registerSignUp("password")}
            placeholder="Enter your Password"
            className="col-span-3 dark:border-gray-400"
          />
          {errorsSignUp.password && (
            <p className="text-red-500">{errorsSignUp.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signupStudentId">Student ID</Label>
          <Input
            id="signupStudentId"
            name="studentId"
            type="text"
            {...registerSignUp("studentId")}
            placeholder="Enter your Student ID"
            className="col-span-3 dark:border-gray-400"
          />
          {errorsSignUp.studentId && (
            <p className="text-red-500">{errorsSignUp.studentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signupDepartment">Department</Label>
          <Select
            id="signupDepartment"
            {...registerSignUp("department")}
            className="w-full"
          >
            <SelectTrigger placeholder="Select Department">
              <SelectContent>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="EEE">EEE</SelectItem>
                <SelectItem value="ME">ME</SelectItem>
                <SelectItem value="CE">CE</SelectItem>
              </SelectContent>
            </SelectTrigger>
          </Select>
          {errorsSignUp.department && (
            <p className="text-red-500">{errorsSignUp.department.message}</p>
          )}
        </div>
      </div>
    </div>

    <div className="space-y-4 mt-6">
      <Label>Status</Label>
      <RadioGroup
        className="flex justify-between"
        {...registerSignUp("status")}
        onValueChange={(value) => setIsAlumni(value === "alumni")}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="current" id="current" />
          <Label htmlFor="current">Current Student</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="alumni" id="alumni" />
          <Label htmlFor="alumni">CUET Alumni</Label>
        </div>
      </RadioGroup>
      {errorsSignUp.isAlumni && (
        <p className="text-red-500">{errorsSignUp.isAlumni.message}</p>
      )}
    </div>

    {isAlumni && (
      <Dialog open={isAlumni} onOpenChange={setIsAlumni}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alumni Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                name="batch"
                type="text"
                {...registerSignUp("batch")}
                placeholder="Enter your batch"
              />
              {errorsSignUp.batch && (
                <p className="text-red-500">{errorsSignUp.batch.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                type="text"
                {...registerSignUp("graduationYear")}
                placeholder="Enter your graduation year"
              />
              {errorsSignUp.graduationYear && (
                <p className="text-red-500">
                  {errorsSignUp.graduationYear.message}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}

    <Button className="w-full mt-6" type="submit">
      <LogIn className="mr-2 w-4 h-4" /> Sign Up
    </Button>
  </form>
</TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default page;
