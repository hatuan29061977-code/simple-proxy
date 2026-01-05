const express = require("express");
const { google } = require("googleapis");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 10000;

/* ================== CẤU HÌNH GOOGLE ================== */
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://simple-proxy-ho1e.onrender.com/oauth2callback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

let accessToken = null;

/* ================== ROUTES ================== */

// Trang test
app.get("/", (req, res) => {
  res.send("Drive Proxy is running");
});

// LOGIN GOOGLE
app.get("/login", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  res.redirect(authUrl);
});

// CALLBACK
app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  accessToken = tokens.access_token;
  res.send("Login Google thành công! Bạn có thể đóng tab này.");
});

// LIST FILE DRIVE
app.get("/drive/list", async (req, res) => {
  if (!accessToken) {
    return res.send("Chưa login Google. Vào /login trước.");
  }

  const drive = google.drive({ version: "v3", auth: oauth2Client });
  const result = await drive.files.list({
    pageSize: 10,
    fields: "files(id, name)",
  });

  res.json(result.data.files);
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
