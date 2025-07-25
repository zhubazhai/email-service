require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// 配置文件存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// 配置 QQ 邮箱的 SMTP 服务
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.QQ_EMAIL,
    pass: process.env.QQ_EMAIL_PASSWORD,
  },
});

// 定义发送邮件的 API
app.post("/api/send-email", upload.single("file"), (req, res) => {
  const { to, subject, text, name } = req.body;

  // 获取上传的文件路径
  const attachmentPath = path.join(__dirname, "static", req.file.filename);

  const mailOptions = {
    from: process.env.QQ_EMAIL,
    to,
    subject,
    text,
    attachments: [
      {
        filename: name,
        path: attachmentPath,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send(`Error sending email: ${error.message}`);
    } else {
      // 发送成功后删除文件
      fs.unlink(attachmentPath, (deleteError) => {
        if (deleteError) {
          console.error("Error deleting file:", deleteError);
          res.status(500).send(`Error deleting file: ${deleteError.message}`);
        } else {
          res.status(200).send("Email sent successfully and file deleted");
        }
      });
    }
  });
});

module.exports = { app };
