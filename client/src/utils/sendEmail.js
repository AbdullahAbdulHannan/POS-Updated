// src/utils/sendAdminEmail.js
import emailjs from 'emailjs-com';

export const sendAdminEmail = async ({ name, email, adminId, password }) => {
  try {
    const result = await emailjs.send(
      'service_0opcduc',
      'template_1ckxnip',
      {
        name,
        email,
        adminId,
        password,
      },
      'vilDYhYSYSmTk4ILv'
    );
    console.log('  Email sent to admin:', result.status);
    return true;
  } catch (error) {
    console.error('❌ Failed to send admin email:', error);
    return false;
  }
};
