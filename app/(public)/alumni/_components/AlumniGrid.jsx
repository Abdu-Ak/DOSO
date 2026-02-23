import React from "react";
import AlumniCard from "./AlumniCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ALUMNI_DATA = [
  {
    name: "Abdullah Yusuf",
    batch: "Class of 2018",
    occupation: "Software Engineer",
    description:
      "Senior Developer at TechGlobal Solutions, specializing in backend architecture.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeegHrgXf7TcBU_tPVVQqVlJrZdKSin7gNl5SHTyRATXsL1yYwU-ZUXsjRzviKMrrJ2oMWCaJXEWnghr1SsYzjEGqOJwI8sYexd5Wn2HySUhzam-8KPYfWivfqrJAhcVsUOJyRr6-P5LCIHcD1aP8VW5OvIUaOrPVokHdZvVNeO3Jzewwem8VFbl6-X3TyekNcrDtm5BtNg5RPVkBOtYPdiwXDU8hq7lWvJM1I4-q9vIcfS18bqxYZDFtHiY3jk6bv0aNpdo2efQ",
    gradientFrom: "primary",
    occupationColor: "primary",
  },
  {
    name: "Fatima Ahmed",
    batch: "Class of 2019",
    occupation: "Research Scholar",
    description:
      "PhD Candidate in Islamic Finance at International University.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5F2n_r2VjaIiwhaV4A-vA8wLEn5kYQ8accqvIFu-Vfr-OspqJZKC3kBFp-RVdnMpvvgzFxEGhD3cNYh9TlC6gPPwajWRvPzO2ifDrz8NsplKklxuODVjF8V9sC3xprdcEd8sEuQTyHm3l8Uud8sXB_UvvXyEaZ9KloveiVhvIx2n_3_-7A1H1FKH2yaYgTCdkHTzBtk10eN74-m8aFXOuZAfwodKjvQ_b9D6CMYMS1QtNk2z4-JYaMuejkkxL68qMMEgCv86UYw",
    gradientFrom: "teal",
    occupationColor: "teal",
  },
  {
    name: "Ibrahim Khalid",
    batch: "Class of 2015",
    occupation: "Business Owner",
    description: "Founder of Halal Organic Foods, serving the local community.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAP3dGgTsFCJH4FnzKhpQauqoXZErDWcuhmbKHlRLFql4GenxERsj7po8ksxQUqzg6kcPg0wxL7Lf_yx9jMH-Und4ryShhCq_NUMJ442Jeloqz6XzXBVZ2WcOl98XgfSHqoSpJyxtXxYPAHMS-AaLv0c0wA3alRbIfB8ur6tVC4nzScBH7IyWBnRGnUHtKzSYVgOWiJUgL1JyS56w1nhfq8t0zkx06zMGsIsFsLJt4D0Ak6TsLDMVuLnyxgpE1hazHCNjfz9oTlg",
    gradientFrom: "orange",
    occupationColor: "orange",
  },
  {
    name: "Aisha Rahman",
    batch: "Class of 2020",
    occupation: "Medical Doctor",
    description:
      "Pediatrician at City General Hospital, passionate about child healthcare.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5F2n_r2VjaIiwhaV4A-vA8wLEn5kYQ8accqvIFu-Vfr-OspqJZKC3kBFp-RVdnMpvvgzFxEGhD3cNYh9TlC6gPPwajWRvPzO2ifDrz8NsplKklxuODVjF8V9sC3xprdcEd8sEuQTyHm3l8Uud8sXB_UvvXyEaZ9KloveiVhvIx2n_3_-7A1H1FKH2yaYgTCdkHTzBtk10eN74-m8aFXOuZAfwodKjvQ_b9D6CMYMS1QtNk2z4-JYaMuejkkxL68qMMEgCv86UYw",
    gradientFrom: "indigo",
    occupationColor: "indigo",
  },
  {
    name: "Omar Hassan",
    batch: "Class of 2017",
    occupation: "Islamic Scholar",
    description:
      "Imam and teacher at Central Mosque, specializing in Quranic studies.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeegHrgXf7TcBU_tPVVQqVlJrZdKSin7gNl5SHTyRATXsL1yYwU-ZUXsjRzviKMrrJ2oMWCaJXEWnghr1SsYzjEGqOJwI8sYexd5Wn2HySUhzam-8KPYfWivfqrJAhcVsUOJyRr6-P5LCIHcD1aP8VW5OvIUaOrPVokHdZvVNeO3Jzewwem8VFbl6-X3TyekNcrDtm5BtNg5RPVkBOtYPdiwXDU8hq7lWvJM1I4-q9vIcfS18bqxYZDFtHiY3jk6bv0aNpdo2efQ",
    gradientFrom: "emerald",
    occupationColor: "emerald",
  },
  {
    name: "Mariam Ali",
    batch: "Class of 2021",
    occupation: "Educator",
    description:
      "High School Teacher focusing on Islamic History and Arabic Language.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5F2n_r2VjaIiwhaV4A-vA8wLEn5kYQ8accqvIFu-Vfr-OspqJZKC3kBFp-RVdnMpvvgzFxEGhD3cNYh9TlC6gPPwajWRvPzO2ifDrz8NsplKklxuODVjF8V9sC3xprdcEd8sEuQTyHm3l8Uud8sXB_UvvXyEaZ9KloveiVhvIx2n_3_-7A1H1FKH2yaYgTCdkHTzBtk10eN74-m8aFXOuZAfwodKjvQ_b9D6CMYMS1QtNk2z4-JYaMuejkkxL68qMMEgCv86UYw",
    gradientFrom: "purple",
    occupationColor: "purple",
  },
  {
    name: "Yusuf Ibrahim",
    batch: "Class of 2016",
    occupation: "Civil Engineer",
    description:
      "Project Manager at BuildRight Construction, specializing in infrastructure.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAP3dGgTsFCJH4FnzKhpQauqoXZErDWcuhmbKHlRLFql4GenxERsj7po8ksxQUqzg6kcPg0wxL7Lf_yx9jMH-Und4ryShhCq_NUMJ442Jeloqz6XzXBVZ2WcOl98XgfSHqoSpJyxtXxYPAHMS-AaLv0c0wA3alRbIfB8ur6tVC4nzScBH7IyWBnRGnUHtKzSYVgOWiJUgL1JyS56w1nhfq8t0zkx06zMGsIsFsLJt4D0Ak6TsLDMVuLnyxgpE1hazHCNjfz9oTlg",
    gradientFrom: "primary",
    occupationColor: "primary",
  },
  {
    name: "Zainab Malik",
    batch: "Class of 2022",
    occupation: "Social Worker",
    description: "Community Outreach Coordinator at Hope Foundation.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5F2n_r2VjaIiwhaV4A-vA8wLEn5kYQ8accqvIFu-Vfr-OspqJZKC3kBFp-RVdnMpvvgzFxEGhD3cNYh9TlC6gPPwajWRvPzO2ifDrz8NsplKklxuODVjF8V9sC3xprdcEd8sEuQTyHm3l8Uud8sXB_UvvXyEaZ9KloveiVhvIx2n_3_-7A1H1FKH2yaYgTCdkHTzBtk10eN74-m8aFXOuZAfwodKjvQ_b9D6CMYMS1QtNk2z4-JYaMuejkkxL68qMMEgCv86UYw",
    gradientFrom: "teal",
    occupationColor: "teal",
  },
];

export default function AlumniGrid() {
  return (
    <>
      {/* Stats Overview */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Showing {ALUMNI_DATA.length} Alumni
        </h2>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Sorted by:{" "}
          <span className="font-semibold text-primary cursor-pointer">
            Relevance
          </span>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ALUMNI_DATA.map((alumni, index) => (
          <AlumniCard key={index} {...alumni} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <nav
          aria-label="Pagination"
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        >
          <a
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:ring-slate-700 dark:hover:bg-slate-800"
            href="#"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft size={20} />
          </a>
          <a
            aria-current="page"
            className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            href="#"
          >
            1
          </a>
          <a
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800"
            href="#"
          >
            2
          </a>
          <a
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800"
            href="#"
          >
            3
          </a>
          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0 dark:text-slate-400 dark:ring-slate-700">
            ...
          </span>
          <a
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800"
            href="#"
          >
            12
          </a>
          <a
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 dark:ring-slate-700 dark:hover:bg-slate-800"
            href="#"
          >
            <span className="sr-only">Next</span>
            <ChevronRight size={20} />
          </a>
        </nav>
      </div>
    </>
  );
}
