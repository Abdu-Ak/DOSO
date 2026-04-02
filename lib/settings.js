import Setting from "@/models/Setting";
import dbConnect from "./mongodb";

export const DEFAULT_SETTINGS = {
  leadership: {
    president: {
      name: "Sheikh Abdul Rahman",
      title: "President",
      email: "info@darulhidayadars.org",
      phone: "101",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBi8J5tmulyHKlkcxkgxjSJ7t-IgEFACHK8wvRVyqDbz6vhdlQsvg3GfX1HjYvKEPzkcQT9cqq6WEZnFFIpQYHlijQXH0SJjRp-ma6UBZbVmZcuswSiY1Ut7DiMQm8yIAp1l3jwHD7gV_vqArDxUl_Ghdgr8SaiPB7IkPMv-yEb3BQb3J3kRUf24pzfZftjhRtET_k_jhQtHm_Cs6LeX0CmJp5-cWzhw8cRGABzV7IxEsQBvS3UWSUCJxsdcNM-0053JpPtYBlkPA",
    },
    secretary: {
      name: "Ustadh Karim",
      title: "Secretary",
      email: "info@darulhidayadars.org",
      phone: "105",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCHvyXsK9n1h9yHJkm6hML0yUtgDNFGzfLIVPtGsSsf-HGyeo1e865ytmQNCgaOuVSsViUpSeXf_qTFl5lmZH9G9McLN1-LUA46TOPPQCwakeDY4ECrHPn818dFB4xm7xfKVy3x4haV_NMV8UEcKhKfs42Nibkh4cf4pzR9u3PRcQvpx3WWjMM0FkqBeyXT-o2gq7HWLneMxeMr8zuryCZDNjKk9SvO9w7lMW00XRAzQawQDJcwmEgPGB90lRTIrGvFIP25v9Kheg",
    },
    headmaster: {
      name: "Maulana Yusuf Hassan",
      title: "Head Master",
      email: "headmaster@darulhidaya.edu",
      phone: "110",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAEsBOlXNVHfEtmlTuap1Dgtchdwwe74lTGaNMqtjnU7bhpZn1UhhjFhBbi4QTPDgZRLjyXnhN_JX2lF5k0ffhCQ0vc0kJcmi3SkBouZ29nsVXunL3VQuvrt3l-_2-4wc5gH36wgFG5e8vAl_3M5g-VFWm0Uk6yczMrCnlXXR1tlcdn7yRwrC0nagG4jyUk5k6zx8WGsZVot4RaNf6dpFabDpNv6rsNAOO7bRA3FvDgDlxzkqR6yHYUNgLGrW4ubOe8cu-B-Yu8_w",
    },
  },
  contact: {
    email: "info@darulhidayadars.org",
    phone: "+1 (234) 567-8900",
    address: "123 Islamic Center Road, Cityville, State 12345",
    mapLink: "https://maps.google.com",
  },
};

export async function getSettings() {
  await dbConnect();
  let settings = await Setting.findOne();
  if (!settings) {
    return DEFAULT_SETTINGS;
  }
  return settings.toObject();
}
