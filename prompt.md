@UserForm.jsx @route.js# User Management System Refactor

This document defines the requirements for refactoring the **User Management System** in a **Next.js (App Router)** application.

The system must support a **multi-role based user structure** with dynamic forms and backend-generated user IDs.

---

# Roles

The system must support three roles:

- `admin`
- `student`
- `alumni`

Each role has **different required fields and validation rules**.

---

# General Requirements

1. The form must be **role-based**.
2. When a role is selected, display the corresponding fields dynamically.
3. All fields mentioned for each role must be **required** unless otherwise specified.
4. Every user must contain a `role` field.
5. Admin login uses:
   - `username`
   - `email`
6. Student and Alumni login uses:
   - `userId`
   - `email`
7. `userId` **must NOT appear in the form**. It must be **generated automatically in the backend**.
8. Every user must contain an `image` field that is **required** ecxept admin.
9. Every user must contain a `password` field that is **required** and need validation rule as minimum 6 characters.

---

# Admin Fields

Required fields:

- Full Name
- Username
- Email
- Phone Number
- Role (`admin`)

Validation rules:

- All fields are required
- Email must be valid
- Phone number must be numeric

---

# Student Fields

Required fields:

- Madrasa Name
- Student Name
- House Name
- Address
- District
- Date of Birth
- Father Name
- Guardian Name
- Guardian Phone Number
- Guardian Relation
- Guardian Occupation
- Date of Admission

---

## District Field

District must be a **dropdown select** containing the **14 districts of Kerala**:

- Thiruvananthapuram
- Kollam
- Pathanamthitta
- Alappuzha
- Kottayam
- Idukki
- Ernakulam
- Thrissur
- Palakkad
- Malappuram
- Kozhikode
- Wayanad
- Kannur
- Kasaragod
- Other

If **"Other"** is selected:

- Show a **text input field**
- Allow the user to enter a **custom district name**

---

## Guardian Relation

This must be a **radio input** with the following options:

- Father
- Mother
- Other

---

# Alumni Fields

Required fields:

- Full Name
- House Name
- Phone Number
- Father Name
- Address
- Post Office
- District
- Pincode
- Batch
- Education

---

## District

Use the same **district dropdown logic** as the Student form, including:

- 14 districts
- "Other" option
- Custom district text input when "Other" is selected

---

## Batch Field

Batch must be a **dropdown showing the last 25 years**.


Example: 
2025
2024
2023
...
(last 25 years)


---

# User ID Generation (Backend Logic)

For **students and alumni**, the system must generate a unique `userId`.

The format must be:

[DISTRICT_SHORT]-[YEAR]-[AUTO_INCREMENT]

Example:

MLP-2022-001
KNR-2021-045
TVM-2023-012

Where:

### District Short Codes

| District | Code |
|--------|------|
| Thiruvananthapuram | TVM |
| Kollam | KLM |
| Pathanamthitta | PTA |
| Alappuzha | ALP |
| Kottayam | KTM |
| Idukki | IDK |
| Ernakulam | EKM |
| Thrissur | TSR |
| Palakkad | PKD |
| Malappuram | MLP |
| Kozhikode | KKD |
| Wayanad | WYD |
| Kannur | KNR |
| Kasaragod | KSD |

---

### Year Value

- **Student** → Admission Year
- **Alumni** → Batch Year

---

### Auto Increment

The number must:

- Increase sequentially for each student/alumni not admin
- Be **padded to 3 digits**

Examples:

001
002
003

---

# Login Rules

## Admin Login

Admins login using:


username + email


---

## Student / Alumni Login

Students and Alumni login using:


userId + email


---

# Form Behaviour

The system must support the following behaviors:

- Dynamic fields based on selected role
- Required field validation
- District dropdown with "Other" custom option
- Guardian relation radio buttons
- Batch dropdown showing last 25 years
- Backend generated userId for students and alumni

---

# Expected Implementation

The completed implementation must include:

1. Dynamic role-based form
2. Frontend validation
3. Backend userId generation logic
4. District dropdown with custom option
5. Batch year generator
6. Proper schema supporting admin, student, and alumni
7. Authentication logic supporting different login types