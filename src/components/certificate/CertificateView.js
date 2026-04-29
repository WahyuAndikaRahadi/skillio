"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CheckCircle2, Download, Copy, Check, ShieldCheck, Award } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import Swal from "sweetalert2";

const CERT_W = 1120;
const CERT_H = 792;

const CertificateView = ({ certData }) => {
  const certificateRef = useRef(null);
  const containerRef   = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied]           = useState(false);
  const [scale, setScale]                 = useState(1);

  const [logoSrc, setLogoSrc]             = useState("/images/skillio-logo.png");

  useEffect(() => {
    fetch("/images/skillio-logo.png")
      .then((r) => r.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => setLogoSrc(reader.result);
        reader.readAsDataURL(blob);
      })
      .catch(() => {});
  }, []);

  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.offsetWidth;
      setScale(Math.min(1, w / CERT_W));
    }
  }, []);

  useEffect(() => {
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateScale]);

  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/${certData.id}`
      : `https://skillio.id/verify/${certData.id}`;

  const formattedDate = new Date(certData.issueDate).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 15000,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pw, ph);
      pdf.save(`Skillio-Certificate-${certData.participantName.replace(/\s+/g, "-")}.pdf`);
    } catch (e) {
      console.error("PDF error:", e);
      Swal.fire({
        icon: "error",
        title: "Gagal Unduh",
        text: "Sertifikat gagal dibuat, silakan coba beberapa saat lagi.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const addToLinkedIn = () => {
    const p = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: `Kuasai ${certData.courseName} dalam 30 Hari`,
      organizationName: "Skillio Indonesia",
      issueYear: new Date(certData.issueDate).getFullYear().toString(),
      issueMonth: (new Date(certData.issueDate).getMonth() + 1).toString(),
      certUrl: verificationUrl,
      certId: certData.id,
    });
    window.open(`https://www.linkedin.com/profile/add?${p.toString()}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-sm font-black">
          <CheckCircle2 size={15} />
          Sertifikat Terverifikasi
        </div>
      </div>

      {}
      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Sertifikat <span className="text-skillio-600">Resmi Skillio</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Dokumen sah penyelesaian program intensif 30 hari.
        </p>
      </div>

      {}
      <div ref={containerRef} className="w-full rounded-2xl overflow-hidden shadow-lg">
        <div style={{ height: CERT_H * scale, position: "relative" }}>
          <div
            ref={certificateRef}
            style={{
              width: CERT_W,
              height: CERT_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              position: "absolute",
              top: 0, left: 0,
              overflow: "hidden",
              background: "#ffffff",
              fontFamily: "'Segoe UI', system-ui, sans-serif",
            }}
          >

            {}
            <div style={{
              position: "absolute", left: 0, top: 0,
              width: 240, height: "100%",
              background: "linear-gradient(175deg, #1d4ed8 0%, #1e3a8a 100%)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "space-between",
              padding: "40px 24px",
            }}>
              {}
              <div style={{ width: "100%" }}>
                <div style={{
                  display: "inline-block",
                  background: "#ffffff",
                  borderRadius: 10,
                  padding: "7px 14px",
                }}>
                  {}
                  <img
                    src={logoSrc}
                    alt="Skillio"
                    style={{ height: 26, objectFit: "contain", display: "block" }}
                  />
                </div>
                <div style={{ height: 3, width: 36, background: "#93c5fd", borderRadius: 99, marginTop: 14 }} />
              </div>

              {}
              <div style={{
                position: "relative", width: 130, height: 130,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)" }} />
                <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.22)" }} />
                <div style={{
                  width: 74, height: 74, borderRadius: "50%",
                  background: "rgba(255,255,255,0.13)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Award size={34} color="#93c5fd" />
                </div>
              </div>

              {}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ padding: 8, background: "#fff", borderRadius: 12 }}>
                  <QRCodeSVG value={verificationUrl} size={84} level="H" includeMargin={false} />
                </div>
                <p style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
                  textAlign: "center",
                }}>
                  Scan to Verify
                </p>
              </div>
            </div>

            {}
            <div style={{
              position: "absolute",
              left: 240, top: 0, right: 0, bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "44px 60px 44px 56px",
              gap: 0,
            }}>
              {}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ height: 2, width: 24, background: "#1d4ed8", borderRadius: 99 }} />
                <p style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: "0.28em",
                  textTransform: "uppercase", color: "#64748b",
                }}>
                  Certificate of Completion
                </p>
              </div>

              {}
              <p style={{ fontSize: 16, color: "#94a3b8", fontStyle: "italic", marginBottom: 8 }}>
                This certifies that
              </p>

              {}
              <h2 style={{
                fontSize: 72, fontWeight: 900, color: "#0f172a",
                lineHeight: 1.0, letterSpacing: "-2px", marginBottom: 14,
                wordBreak: "break-word",
              }}>
                {certData.participantName}
              </h2>

              {}
              <div style={{ height: 4, width: 80, background: "#1d4ed8", borderRadius: 99, marginBottom: 22 }} />

              {}
              <p style={{
                fontSize: 17, color: "#475569", lineHeight: 1.65,
                maxWidth: 560, marginBottom: 26,
              }}>
                has successfully completed the 30-day intensive learning journey
                on the Skillio AI platform, demonstrating professional-grade mastery in:
              </p>

              {}
              <div style={{
                display: "inline-flex", alignSelf: "flex-start",
                background: "#eff6ff", border: "2px solid #bfdbfe",
                borderRadius: 14, padding: "12px 24px",
                marginBottom: 36,
              }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#1d4ed8", letterSpacing: "-0.5px" }}>
                  {certData.courseName}
                </span>
              </div>

              {}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 20,
                borderTop: "1px solid #f1f5f9",
              }}>
                <div>
                  <p style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: "#94a3b8", marginBottom: 5,
                  }}>
                    Date of Achievement
                  </p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: "#0f172a" }}>
                    {formattedDate}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: "#94a3b8", marginBottom: 5,
                  }}>
                    Certificate ID
                  </p>
                  <p style={{
                    fontSize: 12, fontFamily: "monospace", fontWeight: 700,
                    color: "#334155", letterSpacing: "0.06em",
                  }}>
                    {certData.id.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck size={15} className="text-emerald-500 flex-shrink-0" />
          <span className="font-bold text-slate-700">Secured by Skillio AI</span>
          <span className="text-slate-200 hidden sm:inline">·</span>
          <span className="text-slate-400 text-xs font-mono hidden sm:inline">
            {certData.id.slice(0, 12).toUpperCase()}…
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addToLinkedIn}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-black hover:border-[#0077b5] hover:text-[#0077b5] transition-colors"
          >
            <FaLinkedin size={15} className="text-[#0077b5]" />
            LinkedIn
          </button>

          <button
            onClick={copyLink}
            title="Salin link verifikasi"
            className="p-2.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isCopied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default CertificateView;
