import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, "../db/blocked_extensions.db");

// DB 파일 연결
const db = new sqlite3.Database(dbFile, (err) => {
  if (err){
    console.log("DB 연결 실패:", err);
  }else{
    console.log("DB  연걸 성공");
  }
});

// 커스텀 확장자 테이블
db.run(`
  CREATE TABLE IF NOT EXISTS blocked_extensions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ext TEXT UNIQUE
  );
`);

// 고정 확장자 테이블
db.run(`
  CREATE TABLE IF NOT EXISTS fixed_extensions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ext TEXT UNIQUE,
    blocked INTEGER DEFAULT 0
  );
`);

// 기본 고정 확장자 삽입
const defaultFixed = ["bat", "cmd", "com", "cpl", "exe", "scr", "js"];

defaultFixed.forEach(ext => {
  db.run(
    "INSERT OR IGNORE INTO fixed_extensions (ext, blocked) VALUES (?, 0)",
    [ext],
    (err) => {
      if(err){
        console.error(`기본 확장자 삽입 오류 (${ext}):`, err);
      }
    }
  );
});

export default db;
