import express from "express";
import multer from "multer";
import db from "../models/extDB.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, msg: "파일이 없습니다." });
  }

  const ext = req.file.originalname.split(".").pop().toLowerCase();

  // 고정 확장자 검사
  db.all("SELECT ext, blocked FROM fixed_extensions", [], (err, fixed) => {
    const fixedBlocked = fixed.filter(f => f.blocked === 1).map(f => f.ext);

    if (fixedBlocked.includes(ext)) {
      return res.json({
        allowed: false,
        msg: `${ext} 확장자는 고정 확장자로 차단되었습니다.`
      });
    }

    // 커스텀 확장자 검사
    db.all("SELECT ext FROM blocked_extensions", [], (err, rows) => {
      const customBlocked = rows.map(r => r.ext);

      if (customBlocked.includes(ext)) {
        return res.json({
          allowed: false,
          msg: `${ext} 확장자는 커스텀 확장자로 차단되었습니다.`
        });
      }

      res.json({
        allowed: true,
        msg: "업로드가 가능합니다."
      });
    });
  });
});

export default router;
