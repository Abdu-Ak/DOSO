import PublicRegistrationForm from "@/components/public/PublicRegistrationForm";

export const metadata = {
  title: "Student Registration",
  description: "Register as a student at Darul Hidaya Dars and begin your journey of Islamic education and spiritual growth.",
};

export default function StudentRegistrationPage() {
  return <PublicRegistrationForm role="student" />;
}
