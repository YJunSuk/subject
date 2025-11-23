import express from "express";
import db from "../models/extDB.js";

const router = express.Router();

// 전체 목록 조회
router.get("/", (req, res) => {
  db.all("SELECT * FROM blocked_extensions", [], (err, rows) => {
    if (err) return res.status(500).json({ ok: false });
    res.json(rows);
  });
});

// 커스텀 확장자 추가
router.post("/", (req, res) => {
  const { ext } = req.body;
  if (!ext) return res.status(400).json({ ok: false, msg: "확장자를 입력하세요." });

  const lower = ext.trim().toLowerCase();

  if (!/^[a-zA-Z0-9]+$/.test(lower)) {
    return res.status(400).json({ ok: false, msg: "확장자는 영어와 숫자만 입력할 수 있습니다." });
  }

  if (lower.length > 20) {
    return res.status(400).json({ ok: false, msg: "확장자는 최대 20자까지 가능합니다." });
  }

  db.get("SELECT ext FROM blocked_extensions WHERE ext = ?", [lower], (err, row) => {
    if (row) {
      return res.status(400).json({ ok: false, msg: "이미 존재하는 확장자입니다." });
    }

    db.get("SELECT COUNT(*) AS cnt FROM blocked_extensions", [], (err2, countRow) => {
      if (countRow.cnt >= 200) {
        return res.status(400).json({ ok: false, msg: "커스텀 확장자는 최대 200개까지 가능합니다." });
      }

      // DB 삽입
      db.run(
        "INSERT INTO blocked_extensions(ext) VALUES(?)",
        [lower],
        (err3) => {
          if (err3) return res.status(500).json({ ok: false, msg: "DB 오류" });
          res.json({ ok: true });
        }
      );
    });
  });
});

// 삭제
router.delete("/:ext", (req, res) => {
  db.run(
    "DELETE FROM blocked_extensions WHERE ext = ?",
    [req.params.ext],
    (err) => {
      if (err) return res.status(500).json({ ok: false });
      res.json({ ok: true });
    }
  );
});

export default router;
