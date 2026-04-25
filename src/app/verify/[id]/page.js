import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CertificateView from "@/components/certificate/CertificateView";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const data = await prisma.userRoadmap.findUnique({
    where: { id },
    include: {
      user: true,
      category: true,
    },
  });
// ... (rest of metadata logic remains same)
  if (!data) return { title: "Certificate Not Found | Skillio" };

  const name = data.user.name || "Peserta Skillio";
  const course = data.category.name;

  return {
    title: `Sertifikat ${name} - ${course} | Skillio`,
    description: `Verifikasi sertifikat resmi Skillio untuk ${name} dalam bidang ${course}. Selesai pada ${new Date(data.completed_at || data.started_at).toLocaleDateString('id-ID')}.`,
    openGraph: {
      title: `Sertifikat Resmi Skillio: ${name}`,
      description: `Telah menyelesaikan kursus 30 hari: ${course}`,
      images: [
        {
          url: "/images/certificate-template.png",
          width: 1200,
          height: 630,
          alt: "Skillio Certificate Preview",
        },
      ],
    },
  };
}

export default async function VerifyPage({ params }) {
  const { id } = await params;

  const certificate = await prisma.userRoadmap.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        }
      },
      category: {
        select: {
          name: true,
        }
      },
    },
  });

  if (!certificate) {
    notFound();
  }

  // Formatting data for client component
  const certData = {
    id: certificate.id,
    participantName: certificate.user.name || "Anonymous User",
    courseName: certificate.category.name,
    issueDate: certificate.completed_at || certificate.started_at,
    status: certificate.status,
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:py-20">
      <CertificateView certData={certData} />
    </main>
  );
}
