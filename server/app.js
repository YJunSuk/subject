import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import extRouter from "./routes/extensions.js";
import fixedRouter from "./routes/fixed.js";
import uploadRouter from "./routes/upload.js";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/extensions", extRouter);  // 커스텀 확장자 관리
app.use("/api/fixed", fixedRouter);     // 고정 확장자 관리
app.use("/api/upload", uploadRouter);   // 파일 검사

app.listen(3000, () => {
  console.log("서버 실행중");
});
