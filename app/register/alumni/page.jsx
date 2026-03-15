import PublicRegistrationForm from "@/components/public/PublicRegistrationForm";

export const metadata = {
  title: "Alumni Registration - DOSO",
  description: "Register as an alumni",
};

export default function AlumniRegistrationPage() {
  return <PublicRegistrationForm role="alumni" />;
}
