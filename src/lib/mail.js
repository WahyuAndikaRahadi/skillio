import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "465"),
  secure: process.env.EMAIL_SERVER_PORT === "465",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const currentYear = new Date().getFullYear();

export const sendVerificationEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Skillio" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: "Verifikasi Akun Skillio",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
             <img src="cid:skillio-logo" alt="Skillio Logo" style="width: 64px; height: 64px; margin-bottom: 10px; object-fit: contain;" />
             <h1 style="color: #2b6ea6; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0;">SKILLIO</h1>
          </div>
          <h2 style="color: #0d2133; text-align: center;">Verifikasi Email Anda</h2>
          <p style="color: #4a5568; line-height: 1.6; text-align: center;">
            Halo! Terima kasih telah mendaftar di Skillio. <br/>
            Gunakan kode OTP di bawah ini untuk mengaktifkan akun Anda:
          </p>
          <div style="background: #f3f7fb; padding: 30px; text-align: center; border-radius: 20px; margin: 30px 0; border: 2px dashed #2b6ea6;">
            <h1 style="letter-spacing: 12px; color: #2b6ea6; margin: 0; font-size: 48px; font-weight: 900;">${otp}</h1>
          </div>
          <p style="color: #718096; font-size: 14px; text-align: center; line-height: 1.6;">
            Kode ini berlaku selama 15 menit. <br/>
            Jangan bagikan kode ini kepada siapapun.
          </p>
          <hr style="border: none; border-top: 1px solid #edf2f7; margin: 30px 0;" />
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">
            © ${currentYear} Skillio - Transformasi Karier dengan AI <br/>
            Jika Anda tidak merasa mendaftar, abaikan email ini.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'skillio-logo.png',
          path: path.join(process.cwd(), 'public/images/skillio-logo.png'),
          cid: 'skillio-logo'
        }
      ]
    });

    return info;
  } catch (e) {
    console.error("Nodemailer Send Email Error:", e);
    throw e;
  }
};

export const sendPasswordResetEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Skillio" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: "Reset Password Skillio",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
             <img src="cid:skillio-logo" alt="Skillio Logo" style="width: 64px; height: 64px; margin-bottom: 10px; object-fit: contain;" />
             <h1 style="color: #2b6ea6; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0;">SKILLIO</h1>
          </div>
          <h2 style="color: #0d2133; text-align: center;">Permintaan Reset Password</h2>
          <p style="color: #4a5568; line-height: 1.6; text-align: center;">
            Kami menerima permintaan untuk mereset password akun Anda. <br/>
            Gunakan kode OTP di bawah ini untuk melanjutkan:
          </p>
          <div style="background: #fff5f5; padding: 30px; text-align: center; border-radius: 20px; margin: 30px 0; border: 2px dashed #f56565;">
            <h1 style="letter-spacing: 12px; color: #f56565; margin: 0; font-size: 48px; font-weight: 900;">${otp}</h1>
          </div>
          <p style="color: #718096; font-size: 14px; text-align: center; line-height: 1.6;">
            Jika Anda tidak merasa meminta reset password, silakan abaikan email ini dan pastikan akun Anda tetap aman.
          </p>
          <hr style="border: none; border-top: 1px solid #edf2f7; margin: 30px 0;" />
          <p style="font-size: 12px; color: #a0aec0; text-align: center;">
            © ${currentYear} Skillio - Bangun Karier Impianmu
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'skillio-logo.png',
          path: path.join(process.cwd(), 'public/images/skillio-logo.png'),
          cid: 'skillio-logo'
        }
      ]
    });

    return info;
  } catch (e) {
    console.error("Nodemailer Reset Password Error:", e);
    throw e;
  }
};
