# Prompt for Alumni Debt Module Development

## **Project Context**
We are implementing a **Debt/Loan Management Module** in our existing application. The application follows a specific architectural pattern (Next js, Tailwind css). This module involves two primary personas: **Alumni** and **Admins**.

---

## **1. Core Requirements & Logic**

### **A. Debt Request (Alumni Side)**
- **Constraints:**
    - Maximum Amount: **50,000**.
    - Payment Types: **Single Payment** or **EMI**.
    - Duration: **1, 2, or 3 months** (Max 3).
- **Repayment Logic:**
    - *Single Payment:* Total amount due on the date of the chosen month.
    - *EMI:* Amount is split equally by the number of months; due monthly.
- **Witness Requirement:**
    - The requester must select **2 Alumni** as witnesses.
    - The request remains "Pending Witness Approval" until both respond.

### **B. Witness Workflow**
- **Notification:** Selected witnesses receive an in-app notification and an **email** with a redirect link to the portal.
- **Action:** Witnesses can **Accept** or **Reject**.
- **Rejection:** If a witness rejects, a **Reason** is mandatory.

### **C. Admin Workflow**
- **Visibility:** Admin sees the request only after both witnesses have responded.
- **Action:** Admin can **Approve** (requires a **Receipt Number**) or **Reject** (requires a **Reason**).
- **Tracking:** Admin dashboard must show a table with statuses (e.g., "Approved by Witness 1", "Rejected by Witness 2", "Reason: [text]").

### **D. Notification & Mail System**
- **To Witnesses:** "Alumni [Name] requested you as a witness. [Link to Portal]"
- **To Requester:** - Notification/Mail when a witness accepts or rejects.
    - Notification/Mail when Admin approves (including Receipt No) or rejects (including Reason).

---

## **2. Technical Tasks & Structure**

### **A. Database Schema (Models)**
- **DebtRequest Model:**
    - `requester_id` (FK to User)
    - `amount` (Decimal, max 50000)
    - `payment_type` (Enum: single, emi)
    - `duration_months` (Int: 1, 2, 3)
    - `witness1_id`, `witness2_id` (FK to User)
    - `witness1_status`, `witness2_status` (Enum: pending, approved, rejected)
    - `witness1_reason`, `witness2_reason` (String, nullable)
    - `admin_status` (Enum: pending, approved, rejected)
    - `admin_reason` (String, nullable)
    - `receipt_no` (String, nullable)
    - `status` (Calculated/Enum: Pending Witness, Pending Admin, Approved, Rejected)

### **B. Component Development**
- **Alumni Portal:**
    - `DebtRequestForm`: Form with validation for amount, months, and witness selection.
    - `AlumniDebtTable`: Detail view showing status, witness feedback, admin reasons, and receipt numbers.
- **Witness Portal:**
    - `WitnessActionCard`: Component to view request details and submit Accept/Reject with reason. - make this in as notification panel like the admin's but for the alumni's
- **Admin Portal:**
    - `AdminDebtManagementTable`: Comprehensive view for admins to process requests and view full audit trails.

---

## **3. Implementation Instructions**
1.  **Strictly adhere** to the current design pattern and UI component library used in the project.
2.  **API Endpoints:** Create RESTful endpoints for `POST /debt-requests`, `PATCH /debt-requests/:id/witness-respond`, and `PATCH /debt-requests/:id/admin-respond`.
3.  **Security:** Ensure an Alumni cannot approve their own debt or act as their own witness.
4.  **Email Service:** Integrate the existing mailer to trigger the specific notifications described above.
5.  **Validations:** Implement frontend and backend checks for the 50,000 limit and the 3-month duration limit.

---

## **4. Expected Output**
Provide the code for the **Models**, **API Controllers**, and the **Frontend Components** (using our existing structure) to complete this feature.
