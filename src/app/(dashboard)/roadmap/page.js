import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import RoadmapCatalogClient from "@/components/roadmap/RoadmapCatalogClient";

export default async function RoadmapCatalogPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  // Fetch all categories
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" } // Keep the order of insertion (1-50)
  });

  // Grouping definitions
  const domains = [
    {
      title: "Teknologi & Pengembangan",
      description: "Bidang yang berfokus pada rekayasa perangkat lunak, pengembangan aplikasi, dan infrastruktur sistem.",
      startIndex: 0,
      endIndex: 12
    },
    {
      title: "Data & Kecerdasan Buatan",
      description: "Bidang yang menganalisis data, melatih algoritma, dan membangun solusi berbasis Artificial Intelligence.",
      startIndex: 12,
      endIndex: 20
    },
    {
      title: "Desain & Kreativitas",
      description: "Bidang yang mengutamakan estetika visual, pengalaman pengguna, dan penciptaan aset kreatif.",
      startIndex: 20,
      endIndex: 30
    },
    {
      title: "Konten & Media Digital",
      description: "Bidang yang memproduksi, mengelola, dan mendistribusikan konten multimedia kepada audiens luas.",
      startIndex: 30,
      endIndex: 38
    },
    {
      title: "Bisnis & Pemasaran Digital",
      description: "Bidang yang berfokus pada strategi pertumbuhan, akuisisi pengguna, dan monetisasi produk digital.",
      startIndex: 38,
      endIndex: 47
    },
    {
      title: "Keuangan & Legalitas Digital",
      description: "Bidang krusial yang mengelola investasi, tata kelola data, dan kepatuhan hukum di era digital.",
      startIndex: 47,
      endIndex: 50
    }
  ];

  // Group categories into the domains
  const groupedCategories = domains.map(domain => {
    return {
      ...domain,
      items: categories.slice(domain.startIndex, domain.endIndex)
    };
  });

  // Check if user already has an active roadmap
  const activeRoadmap = await prisma.userRoadmap.findFirst({
    where: { user_id: session.user.id, status: "active" },
    include: { category: true }
  });

  return <RoadmapCatalogClient groupedCategories={groupedCategories} activeRoadmap={activeRoadmap} />;
}
