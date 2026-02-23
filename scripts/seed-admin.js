const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "alumni", "student"],
    default: "student",
  },
  name: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      name: "System Administrator",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
