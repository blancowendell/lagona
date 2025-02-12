const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lagonaexpressmgmt@gmail.com", 
    pass: "mvfe hind hiwk bwym", 
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: '"Lagona Express" <lagonaexpressmgmt@gmail.com>',
      to, 
      subject, 
      text, 
    });

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = sendMail;
