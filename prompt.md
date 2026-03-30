# Task: Separate Student Management and Update Education Fields

## Context

I am refactoring a Next.js application using **Mongoose**, **React Hook Form**, and **HeroUI**.
I am decoupling "Students" from the general User list into a dedicated "Student Management" section.

## 1. Schema Updates (models/User.js)

- **Remove field:** `madrasa_name`.
- **Add field:** `current_madrasa_class` (String) - e.g., "Class 7".
- **Add field:** `current_school_class` (String) - e.g., "9th Standard".
- **Hardcoded Role:** Since the Student Management modal is specific to students, the `role` should be automatically set to `student` on the backend/form submission. No role selection UI is needed for this section.
- **Status:** For public registrations, default `status` remains `Pending`.

## 2. UI Component Update (StudentSection.jsx)

Update the `StudentSection` component:

- **Remove** the "Madrasa Name" field.
- **Add** two new InputFields:
  1. **Current Madrasa Class**: Use `School` icon.
  2. **Current School Class**: Use `School` or `BookOpen` icon.
- **Remove Role/Password logic:** Ensure no role selection is present. If it's a new student creation, the password can be generated or handled as per existing logic, but the UI should stay focused on student data.
- **Public Form:** These changes must reflect in the public-facing registration form.

## 3. Admin Sidebar & Management Logic

- **Sidebar:** Add a "Student Management" menu visible only to `super_admin` and `admin`.
- **User List Filtering:** - Modify the general **User Management** table to **exclude** all users with `role: "student"`.
  - Remove student-related filters (districts, etc.) from the general User list.
- **Student Management Page:**
  - Create a dedicated view that **only** fetches/displays users with `role: "student"`.
  - Implement full CRUD (Add, Edit, Delete, View).

## 4. Authentication Restriction (Temporary)

- **Disable Student Login:** - In the login logic (API route or Auth provider), check the user's role.
  - If `role === 'student'`, **comment out** the session/JWT generation code.
  - Return a response: `{ message: "Student login is currently disabled." }`.

## 5. Filtering & UI

- In the new **Student Management** list, add specific filters for:
  - `district`
  - `status` (Active/Pending/Inactive)
  - `current_madrasa_class`
  - `current_school_class`

## Instructions for AI:

Please provide the updated `StudentSection.jsx`, the modified Mongoose Schema, and the logic for the filtered Student Management table.
