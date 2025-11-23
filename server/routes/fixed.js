import express from "express";
import db from "../models/extDB.js";

const router = express.Router();

// 조회
router.get("/", (req, res) => {
  db.all("SELECT * FROM fixed_extensions", [], (err, rows) => {
    if (err) return res.status(500).json({ ok: false });
    res.json(rows);
  });
});

// 체크박스 업데이트
router.post("/", (req, res) => {
  const { ext, blocked } = req.body;

  db.run(
    "UPDATE fixed_extensions SET blocked = ? WHERE ext = ?",
    [blocked ? 1 : 0, ext],
    (err) => {
      if (err) return res.status(500).json({ ok: false });
      res.json({ ok: true });
    }
  );
});

export default router;