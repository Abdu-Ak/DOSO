import PublicRegistrationForm from "@/components/public/PublicRegistrationForm";

export const metadata = {
  title: "Alumni Registration",
  description: "Register as an alumni of Darul Hidaya Dars. Join our growing network of scholars, leaders, and community members.",
};

export default function AlumniRegistrationPage() {
  return <PublicRegistrationForm role="alumni" />;
}
