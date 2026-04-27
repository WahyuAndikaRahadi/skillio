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

  // Security Check: Only show if status is 'completed'
  if (certificate.status !== "completed") {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4">Sertifikat Belum Tersedia</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Peserta ini masih dalam perjalanan belajar. Sertifikat hanya akan muncul setelah roadmap 30 hari diselesaikan sepenuhnya.
          </p>
          <div className="mt-8 pt-8 border-t border-slate-50">
             <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Skillio Verification System</p>
          </div>
        </div>
      </main>
    );
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

// Minimal imports needed for the error state
import { Clock } from "lucide-react";
