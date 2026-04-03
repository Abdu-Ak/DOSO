# Task: Implement "Sundook" (Welfare Box) Module with Notifications

## 1. Context
We are adding a module called **Sundook** to an existing application. This is a welfare box management system where Alumni submit financial contributions. There are two primary roles: **Admin** and **Alumni**.

## 2. Business Logic & Constraints
* **Submission Limit:** An Alumni can only submit **one** Sundook record per calendar year.
* **Approval Workflow:**
    * Alumni submissions start as `pending`.
    * Admins must review to `approve` (require Receipt Number) or `reject` (require Rejection Reason).
    * Admin-created entries are `auto-approved` and require a Receipt Number immediately.

## 3. Role-Based Requirements

### A. Alumni Portal
* **Form Fields:** `box_number` and `amount` (visible).
* **Background Logic:** Auto-pass `alumni_id` and current `year` in the payload.
* **Table View:** Show personal submissions. 
    * Show `rejection_reason` if status is rejected.
    * Show `receipt_number` if status is approved.

### B. Admin Portal
* **Notification System:** The Admin dashboard must feature a **Notification Badge/List** showing the count of "Pending Sundook Submissions" to alert them that action is required.
* **Management Table:** Master list of all submissions.
    * **Actions:** Approve (modal for `receipt_number`) or Reject (modal for `rejection_reason`).
* **Creation Form:** Admin can create for any Alumni (auto-approved).

## 4. Communication Logic (Email Triggers)
The system must trigger automated emails in the following scenarios:
1.  **On Approval:** Send an email to the Alumni notifying them that their Sundook for [Year] has been approved. Include the `receipt_number` and `amount` in the mail body.
2.  **On Rejection:** Send an email to the Alumni notifying them that their submission was not accepted. Include the `rejection_reason` and instructions to contact support or resubmit.

## 5. Technical Specifications

### Data Schema (Sundook)
* `id`, `alumni_id`, `box_number`, `amount`, `year`, `status`, `receipt_number`, `rejection_reason`, `created_at`.

### API Logic
1.  **POST /sundook**: 
    * Validate 1 entry per user/year.
    * If Alumni: Set `status: pending` and trigger an **Admin Notification**.
    * If Admin: Require `receipt_number` and set `status: approved`.
2.  **PATCH /sundook/:id/status**:
    * **If Approved:** Update status + `receipt_number`. Trigger **Alumni Email**.
    * **If Rejected:** Update status + `rejection_reason`. Trigger **Alumni Email**.

## 6. Instructions for Implementation
Please generate:
1.  **Database Migration** for the Sundook table.
2.  **API Endpoints** with validation, notification logic, and email trigger hooks.
3.  **Frontend Components**:
    * Alumni Form & Table.
    * Admin Dashboard with "Pending" notification badge and management table.
    * Email templates for Approval and Rejection.