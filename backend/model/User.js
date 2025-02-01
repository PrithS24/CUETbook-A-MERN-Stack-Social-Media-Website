const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: null },
  gender:{type:String, default:null},
  studentID: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  userType: { type: String, enum: ["student", "alumni"], required: true }, // Differentiates user type
  batch: { type: String, required: function() { return this.userType === "alumni"; } }, // Alumni-specific
  graduationYear: { type: Number, required: function() { return this.userType === "alumni"; } }, // Alumni-specific
  dateOfBirth:{type:Date, default:null},
  profilePicture:{type:String, defaullt:null},
  coverPhoto:{type:String, default:null},
  followers:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
  following:[{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
  followerCount:{type:Number, default:0},
  followingCount:{type:Number, default:0}
},{timestamps:true});

const User=mongoose.model('User', UserSchema)
module.exports = User;
