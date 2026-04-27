# Prompt: Admin Activity Log Module Implementation

## **Project Context**
I am building an **Admin Activity Log** (Audit Trail). The goal is to track significant data-changing actions performed by admins and display them in a "Platform Activity" feed.

---

## **1. Core Logic & Rules**
- **Capture Strategy:** Track ONLY actions that modify the database (Create, Update, Delete, Approve, Reject).
- **Exclude:** Read-only actions (Detail views, filter applications, PDF generations, searches).
- **Target Modules:** User Management, Debt Module, Events, Welfare, Student Management, Enquires, Settings and Sundook.

## **2. Functional Requirements**

### **A. Activity Tracking Data**
Each activity entry must include:
- **Admin Reference:** The ID/Name of the admin who performed the action.
- **Title:** A concise headline (e.g., "Debt Approved", "Alumni Rejected").
- **Description:** A human-readable summary including the target subject (e.g., "Admin 1 approved debt for Kaleel Rahman").
- **Icon Type:** An identifier for the UI icon (matching the existing design).
- **Timestamp:** The exact time the action was performed.

### **B. Dashboard Widget (Platform Activity)**
- **Limit:** Display the **Last 10 activities**.
- **Design:** Must match the current UI:
    - Circular icon container with a light background.
    - Vertical list structure.
    - Header: Title in bold.
    - Sub-text: Detailed description.
    - Footer: Timestamp in uppercase relative format (e.g., "2 HOURS AGO").
- **Navigation:** Add a **"View All"** button that redirects to the full history page.

### **C. Activity History Page**
- **Route:** `/admin/activity-log`
- **Design:** Standard page layout with:
    - **Search Bar:** To search by admin name or description content.
    - **Date Range Filter:** To filter logs between two specific dates.
    - **Pagination:** To handle large volumes of historical data.

---

## **3. Technical Tasks**

### **A. Database Schema (`ActivityLog`)**
- `adminId` (Foreign Key)
- `actionType` (Enum: CREATE, UPDATE, DELETE, APPROVE, REJECT)
- `module` (String)
- `title` (String)
- `description` (String)
- `icon` (String)
- `createdAt` (DateTime)

### **B. Backend Implementation**
- Create a centralized **Activity Logger Utility** that can be called from any controller.
- **API 1:** `GET /activities/recent` (returns top 10).
- **API 2:** `GET /activities/all` (with support for `search`, `startDate`, `endDate`, and `page` parameters).

### **C. Frontend Implementation**
- Update the **Dashboard Component** to fetch and map the real-time activity data.
- Create the **Activity Log Page** using existing table/list design patterns, ensuring the "Platform Activity" style is maintained.

---

## **4. Design Constraints**
- Follow the exact typography, spacing, and color palette shown in the screenshots.
- Ensure the icons are consistent with the `Lucide` or `FontAwesome` set currently used in the project.
- The relative timestamp logic should be consistent throughout the app.

## Reminder 
- the activities that super admin performs should not be logged in the activity log.

---
**Please provide the implementation code for the Model, the Backend Controller/Helper, and the Frontend Components (Dashboard Widget and Full History Page).**