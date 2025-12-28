import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const TARGET_BACKEND = "https://doggobackend-production.up.railway.app";

app.use(
  "/api",
  createProxyMiddleware({
    target: TARGET_BACKEND,
    changeOrigin: true,
    secure: true,
    cookieDomainRewrite: "", // 쿠키를 프론트 도메인으로 재작성
  })
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
