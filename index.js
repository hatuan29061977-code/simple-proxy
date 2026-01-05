const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy tới Apple
app.use(
  "/apple",
  createProxyMiddleware({
    target: "https://www.apple.com",
    changeOrigin: true,
    pathRewrite: {
      "^/apple": ""
    }
  })
);

// Trang kiểm tra
app.get("/", (req, res) => {
  res.send("Proxy is running");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
