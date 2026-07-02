import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const isSmtpConfigured =
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_HOST;

  const mailContent = `
    ArtistHub Portfolio Platform
    ----------------------------
    Subject: ${options.subject}
    Message: ${options.message}
  `;

  // Always log to console in development so the developer doesn't need to configure SMTP
  console.log('\n======================================================');
  console.log('📬 OUTGOING EMAIL (SIMULATED FOR SANDBOX/DEV):');
  console.log(`To: ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message: ${options.message}`);
  console.log('======================================================\n');

  if (!isSmtpConfigured) {
    // If SMTP is not configured, we return true as a simulated success
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"${process.env.FROM_EMAIL_NAME || 'ArtistHub'}" <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    // Return true anyway so development isn't blocked, but log error
    return false;
  }
};
