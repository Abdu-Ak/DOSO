---
trigger: always_on
---

---

## 1. General Principles

- Always generate **production-ready code**
- Follow **clean code practices**
- Use proper **folder structure**
- Maintain **modular architecture**
- Avoid unnecessary comments and debug code
- Keep naming conventions consistent
- Prefer reusable and scalable patterns

---

# 2. Forms

All forms must use:

- **react-hook-form**
- **Zod**
- **@hookform/resolvers/zod**

## Rules

- Form logic must use `useForm`
- Validation must use `zodResolver`
- Validation schemas must be imported from `lib/validations`
- Do not define validation inside components
- Use @heroui components

## Example

```js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/lib/validations/user.validation";

const form = useForm({
  resolver: zodResolver(createUserSchema),
  defaultValues: {
    name: "",
    email: "",
  },
});
3. Validation Schema Location

All Zod schemas must be placed inside:

lib/validations/
Folder Structure
lib/
 └── validations/
      └── user.validation.js
Example Schema
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
});

Rules:

Never duplicate schemas

Never define schemas inside components

Keep validation centralized

4. Database

MongoDB connection must be managed inside:

lib/mongodb.js
Rules

Do not create new database connection files

Always reuse the existing connection

Use async/await

Handle connection errors properly

Usage
import connectDB from "@/lib/mongodb";
5. Models

All Mongoose models must be located inside:

/models
Example Structure
models/
 ├── User.js
 ├── Product.js
 └── Order.js
Example Model
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

Rules:

Never redefine models

Always prevent model overwrite using:

mongoose.models.ModelName || mongoose.model(...)
6. Image Upload

Image uploads must use Cloudinary

Configuration file location:

lib/cloudinary.js
Rules

Always use the existing Cloudinary configuration

Do not create new upload utilities unless absolutely necessary

Do not hardcode credentials

Use environment variables

Usage
import cloudinary from "@/lib/cloudinary";
7. Folder Structure

Project structure must follow:

/lib
   mongodb.js
   cloudinary.js
   /validations

/models

/components

/app   (Next.js App Router)
or
/pages (Next.js Pages Router)

Rules:

Keep logic separated

Keep API routes organized

Avoid deeply nested unnecessary folders

8. API Rules

All APIs must:

Use async/await

Have proper error handling

Return structured JSON responses

Never expose raw errors in production

Success Response Example
return res.status(200).json({
  success: true,
  data,
});
Error Response Example
return res.status(500).json({
  success: false,
  message: "Internal server error",
});

Rules:

Always return consistent structure

Use correct HTTP status codes

Validate input before database operations

9. Code Quality Rules

Always ensure:

No unused imports

No console.log in production

Proper try/catch blocks

Modular reusable functions

Clean readable structure

Consistent naming conventions

10. AI Code Generation Rules

When generating code, always:

Use Zod validation

Use react-hook-form

Import schemas from lib/validations

Use database from lib/mongodb.js

Use models from /models

Use Cloudinary from lib/cloudinary.js

Follow the defined folder structure

Use async/await

Return structured JSON

Never:

Duplicate validation schemas

Create new MongoDB connection files

Create new Cloudinary configurations

Mix validation inside components

Generate TypeScript types (project uses JavaScript)

11. JavaScript-Specific Rules

Since this project uses JavaScript:

Do not use TypeScript

Do not use interfaces

Do not use generics

Do not add type annotations

Rely fully on Zod for validation safety

Final Standard Summary

This project must follow:

Clean architecture

Centralized validation

Reusable database connection

Centralized models

Cloudinary for uploads

Structured API responses

Production-level quality only