import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";


const app = express();
app.use(cors());
app.use(express.json());



/* =========================
   DATABASE
========================= */

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Test DB connection
pool.query("SELECT 1")
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB ERROR:", err));

/* =========================
   STOCK DATA
========================= */

const SUPPORTED_STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

const stockPrices = {};
SUPPORTED_STOCKS.forEach(s => {
  stockPrices[s] = 200 + Math.random() * 200;
});

// Update prices every second
setInterval(() => {
  SUPPORTED_STOCKS.forEach(s => {
    const delta = (Math.random() - 0.5) * 4;
    stockPrices[s] = +(stockPrices[s] + delta).toFixed(2);
  });
}, 1000);

/* =========================
   AUTH
========================= */

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hash]
  );

  res.json({ userId: result.insertId, email });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length) {
    return res.status(401).json({ message: "Invalid login" });
  }

  const ok = await bcrypt.compare(password, rows[0].password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid login" });
  }

  res.json({ userId: rows[0].id, email });
});

/* =========================
   STOCK APIs
========================= */

app.get("/api/stocks", (req, res) => {
  res.json(
    SUPPORTED_STOCKS.map(s => ({
      symbol: s,
      price: stockPrices[s]
    }))
  );
});

/* =========================
   SUBSCRIPTIONS
========================= */

// Subscribe
app.post("/api/subscriptions", async (req, res) => {
  const { userId, symbol } = req.body;

  await pool.query(
    "INSERT IGNORE INTO subscriptions (user_id, stock_symbol) VALUES (?, ?)",
    [userId, symbol]
  );

  res.json({ success: true });
});

// Unsubscribe (NEW)
app.delete("/api/subscriptions", async (req, res) => {
  const { userId, symbol } = req.body;

  await pool.query(
    "DELETE FROM subscriptions WHERE user_id = ? AND stock_symbol = ?",
    [userId, symbol]
  );

  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
