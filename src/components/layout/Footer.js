import React from "react";
import Link from "next/link";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Sparkles } from "lucide-react"; 

const Footer = () => {
  return (
    <footer className="bg-light-blue/30 pt-20 pb-10 px-6 border-t border-light-blue">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="bg-primary-blue p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-primary-blue">
              SKILLIO
            </span>
          </Link>
          <p className="text-foreground/70 max-w-sm mb-8 leading-relaxed">
            Satu-satunya platform yang tidak hanya memberi materi, tapi memberi
            arah hidup yang nyata melalui AI dan roadmap 30 hari.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white rounded-lg text-primary-blue hover:scale-110 transition-transform shadow-sm">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white rounded-lg text-primary-blue hover:scale-110 transition-transform shadow-sm">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white rounded-lg text-primary-blue hover:scale-110 transition-transform shadow-sm">
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Platform</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-foreground/70 hover:text-primary-blue transition-colors">Cara Kerja</Link></li>
            <li><Link href="#" className="text-foreground/70 hover:text-primary-blue transition-colors">Kategori Karier</Link></li>
            <li><Link href="#" className="text-foreground/70 hover:text-primary-blue transition-colors">AI Mentor</Link></li>
            <li><Link href="#" className="text-foreground/70 hover:text-primary-blue transition-colors">Komunitas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Perusahaan</h4>
          <ul className="space-y-4">
            <li><Link href="#" className="text-foreground/70 hover:text-primary-blue transition-colors">Tentang Kami</Link></li>
            <li><Link href="#" className="text-foreground/70 hover:text-primary-blue transition-colors">Hubungi Kami</Link></li>
            <li><Link href="#" className="text-foreground/70 hover:text-primary-blue transition-colors">Kebijakan Privasi</Link></li>
            <li><Link href="#" className="text-foreground/70 hover:text-primary-blue transition-colors">Syarat & Ketentuan</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-light-blue flex flex-col md:row justify-between items-center gap-4 text-sm text-foreground/50 font-medium">
        <p>© 2026 Skillio Indonesia. Seluruh hak cipta dilindungi.</p>
        <div className="flex gap-8">
          <span>Made with 💙 for Indonesia's Future</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
