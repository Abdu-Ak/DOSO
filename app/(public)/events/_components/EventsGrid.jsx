import React from "react";
import EventCard from "./EventCard";
import { RefreshCw } from "lucide-react";

const EVENTS_DATA = [
  {
    title: "Annual Convocation Ceremony 2023",
    date: "15 Oct 2023",
    category: "Academic",
    categoryColor: "primary",
    description:
      "Celebrating the academic excellence of our graduating scholars. A momentous day filled with inspiration and pride.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPyGDIkJNoY9S2VwOCNQGKG2vtnLl4Z6EVTWOizCIFKWnf3fS4ATQivPdML6X4UKk2B5lC5ICUYIlaKVORvPgOEs4pGu29awXdGCkVj0iFA0t1oq99PMLsLd7GNHhHi7JDRaoqHHDUK5H6OuTU0Z1Buz2ZYl5HlDF7DR7w8QYAwBPnm1RFbwwqlma3FgEXueqMdZzUJ4VG51e5Hj2XkeK6kR1e68teyqF3TAd4CbSF3a5c8OBKB_Y8OprGai34e2FL7nISXrBM3A",
    photoCount: 24,
  },
  {
    title: "Ramadan Grand Iftar Gathering",
    date: "22 Mar 2023",
    category: "Religious",
    categoryColor: "purple",
    description:
      "Bringing the community together for a blessed evening of prayer and breaking fast under the stars.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBO7-UKnkXSkjD203dtg2ABcI4jhZeIp3nyQ5vbyMWdBpv44njYn0CspOJz2eBG3BwpUN94Rhr45ZzW7XmW6AY0URgNiZ5ccKyTE_4kVdr29DwK7gVstoHNqt-l7o451EgDSw0jY5128vMk0RCplEOMvYpJgV-XKD03lpIb8oubnDWV2Ri6MYWW-_frXAOPxp6WbxInL4PEtJ8GaspcA6NWKMdGn3B5fViByzPZeE8r0XKfzgBnBHCYrwyFRhs1n-iwybkJovBjRg",
    photoCount: 18,
  },
  {
    title: "Islamic Arts & Calligraphy Workshop",
    date: "05 Feb 2023",
    category: "Cultural",
    categoryColor: "amber",
    description:
      "Students exploring the intricate beauty of traditional Islamic arts through hands-on sessions.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIF2BvipgMbRTA_fGO4hrCnXE5qtEArPJF3oR1xKd1znokq67_WoxAvzMdGyB8hoDwJw9x1AoKgVAr7ouWjoY_Y8Nmm5u6YDVs6wL1P5wPae1oa_tn_W_kfr13BuWuyUVKHUiG8lMy_y8nwofiG_J74U-C-G5wuF0MHQfrqLeGpFDNaAd-ThZ--53OVt1ybhHdqtUECloViUxV_VpXAT_gO8vahjeFaXJnHJdwhjcgGIz3cVKZPrOS1KvNB-R_nMpEdqmyFOg0lw",
    photoCount: 32,
  },
  {
    title: "Annual Sports Meet",
    date: "12 Jan 2023",
    category: "Sports",
    categoryColor: "emerald",
    description:
      "Fostering team spirit and physical health through friendly competition and athletic excellence.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHFf_mizV69vDcDKBpon11FMKIo4Hv-whdtTTJmUC8TRdMgtShz_VB8Q-jHHosXQKOzRTHsLh0g9Ys-L4L_kkxEwgUcFOmp8hrR6h7aGhy7MplpFfeo56ctXs4QXAsSgekNelg-Sj-AwAhd_dNOUf-dsn4tDyetqB5M_AwOgAvy8qZXR0hjZ3mlR86CyfSnJEx6OmiyM1EFexp345sOD_qfK4v51NgXg0NCuYBzn_gfbF8m0mQY7yttmdeHSn3b53ymMgGwX5GEA",
    photoCount: 45,
  },
  {
    title: "Library Inauguration Day",
    date: "20 Dec 2022",
    category: "Academic",
    categoryColor: "primary",
    description:
      "Opening the doors to a new world of knowledge with our expanded library facilities.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCykHvJ5pmSxoPQd0lMDbgovlrl5nqFlX5wPhCf6w7Rf4XOk3jL26K8b-tQTB5fyhS9SZiRqmeqwS5jvue89UP_IIegER6O1VqjAnwLzDV36FIyyNN42JFmxHYczW5ZgBJj44SPoOWTWZBHk-aLLUpy7NqhJ06Jj21lK4neg3iHq2gwLX9gDJYCoUgccUzI12J5nqxRMD5hZF74wJHy4rBkUmhGZN4zBFnpAAi8VpIB5I6SnUDcjg-yPaFbaN_t2On1py1PdPmqdA",
    photoCount: 12,
  },
  {
    title: "Debate & Public Speaking Contest",
    date: "10 Nov 2022",
    category: "Cultural",
    categoryColor: "amber",
    description:
      "Students articulating their thoughts on contemporary issues with eloquence and confidence.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUoH14QVn6Mdqd_KYYwFREHJBpvHUJ_iNu_YoxsMaJRxAsL83M-QfdhrvVn10k3EiKH5kHk8lT6ZC9fWKpnpHenNUj17DkRMgutCVwTCAlnyN96d0jFcqkx0elke6xQMKWvPqadQ1HA2U_ZMfIjxPzPCM-Ixf3XJJ2hiiFpKBPegY25ETbdiKQ9QifDjrbsY0aQXjZ14AIdC3ThiadikFHjpFcaAUW-y_Pko_AJdifiihoeENYuUVKTfemjwKF8cuY8pcgdXnOfQ",
    photoCount: 15,
  },
];

export default function EventsGrid() {
  return (
    <>
      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {EVENTS_DATA.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-16 text-center">
        <button className="inline-flex items-center px-8 py-3 border border-primary/20 bg-white dark:bg-neutral-dark text-primary dark:text-white text-sm font-bold rounded-lg hover:bg-primary hover:text-white dark:hover:bg-primary transition-all shadow-sm hover:shadow-md">
          Load More Events
          <RefreshCw size={16} className="ml-2" />
        </button>
      </div>
    </>
  );
}
