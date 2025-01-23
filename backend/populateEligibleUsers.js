const mongoose = require("mongoose");
const EligibleUser = require("./model/EligibleUser");
const connectDB = require("./config/db"); // Import your database connection function

// Connect to the database
connectDB();

const populateEligibleUsers = async () => {
  // Example eligible users to pre-fill
  const eligibleUsers = [
    {
      name: "John Doe",
      email: "johndoe@example.com",
      studentID: "ST12345",
      department: "Computer Science",
      userType: "student", // Example of a student
    },
    {
      name: "Jane Smith",
      email: "janesmith@example.com",
      studentID: "ST54321",
      department: "Electrical Engineering",
      userType: "alumni", // Example of an alumni
      batch: "2015-2019",
      graduationYear: 2019,
    },
    {
      name: "Alice Brown",
      email: "alicebrown@example.com",
      studentID: "ST67890",
      department: "Mechanical Engineering",
      userType: "alumni", // Another alumni example
      batch: "2016-2020",
      graduationYear: 2020,
    },
  ];

  try {
    // Clear existing data to avoid duplicates
    await EligibleUser.deleteMany({});
    console.log("Existing eligible users cleared.");

    // Insert new eligible users
    await EligibleUser.insertMany(eligibleUsers);
    console.log("Eligible users added successfully!");
  } catch (error) {
    console.error("Error adding eligible users:", error);
  } finally {
    mongoose.disconnect(); // Disconnect from the database
  }
};

// Run the function
populateEligibleUsers();
