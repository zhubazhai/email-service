require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// 创建邮件发送函数
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey",
      //   pass: process.env.SENDGRID_API_KEY,
      pass: "ruravkqypocjjcaj",
    },
  });

  const mailOptions = {
    from: "1149541057@qq.com",
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

// 定义发送邮件的 API
app.post("/api/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail(to, subject, text);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

module.exports = app;
