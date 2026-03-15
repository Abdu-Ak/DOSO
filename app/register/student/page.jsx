import PublicRegistrationForm from "@/components/public/PublicRegistrationForm";

export const metadata = {
  title: "Student Registration - DOSO",
  description: "Register as a student",
};

export default function StudentRegistrationPage() {
  return <PublicRegistrationForm role="student" />;
}
