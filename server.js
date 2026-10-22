/* ============================================================
   ХААИС — Оюутны зоогийн газар
   server.js — backend сервер
   - Статик сайт үйлчилгээ (index.html гэх мэт файлууд)
   - Нэвтрэх / бүртгүүлэх API (session cookie + scrypt нууц үг)
   - Захиалгын API (SQLite database, node:sqlite)
   - Админ API (зөвхөн role="admin" session-тай хэрэглэгч)
   Node.js 22.5+ хувилбар дээр ажиллана (node:sqlite ашигласан).
   Ажillуулах: node server.js
   ============================================================ */

"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(ROOT, "data");
const DB_FILE = path.join(DATA_DIR, "haais.db");
const SESSION_COOKIE = "haais_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; /* 7 өдөр */

/* ---------- Админ эрхийн default тохиргоо (environment-аар өөрчилж болно) ---------- */
const ADMIN_CODE = process.env.ADMIN_CODE || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

/* ---------- Барааны үнийн сервер талын итгэмжийн жагсаалт ----------
   script.js доторх цэстэй тохирч байх ЁСТОЙ. Үнийг клиентээс биш,
   эндээс авч тооцдог тул төлбөрийн хуйвалдаанаас хамгаална. */
const MENU_PRICES = {
    1: 7500, 2: 9500, 3: 15000, 4: 9000, 5: 10500, 6: 9500,
    7: 1800, 8: 5500, 9: 5500, 10: 9000, 11: 12500, 12: 10500,
    13: 9000, 14: 10000, 15: 4500, 16: 5000, 17: 7500, 18: 5000,
    19: 7000, 20: 20000, 21: 12500, 22: 7000, 23: 4500, 24: 6000
};
const COUPON_RATES = { STUDENT10: 0.10, HA2026: 0.15 };
const ORDER_STATUSES = ["Шинэ", "Баталгаажсан", "Бэлтгэгдэж байгаа", "Хүргэгдсэн", "Цуцлагдсан"];
const PAYMENT_METHODS = ["cash", "qpay", "card"];

/* ============================================================
   Database
   ============================================================ */
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(DB_FILE);
db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number TEXT NOT NULL UNIQUE,
        client_token TEXT UNIQUE,
        user_id INTEGER,
        student_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        payment TEXT NOT NULL,
        coupon TEXT NOT NULL DEFAULT '',
        subtotal INTEGER NOT NULL,
        discount INTEGER NOT NULL,
        total INTEGER NOT NULL,
        pickup_spot TEXT NOT NULL DEFAULT '',
        pickup_date TEXT NOT NULL DEFAULT '',
        pickup_time TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'Шинэ',
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        food_id INTEGER,
        name TEXT NOT NULL,
        unit_price INTEGER NOT NULL,
        qty INTEGER NOT NULL,
        line_total INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
`);

/* Админ бүртгэлийг эхлүүлэх үед үүсгэнэ ( username/нууц үг environment-аар удирдана ) */
(function ensureAdmin() {
    const existing = db.prepare("SELECT id FROM users WHERE student_id = ?").get(ADMIN_CODE.toLowerCase());
    if (existing) return;
    db.prepare("INSERT INTO users (student_id, name, password_hash, role, created_at) VALUES (?, ?, ?, 'admin', ?)")
        .run(ADMIN_CODE.toLowerCase(), "Админ", hashPassword(ADMIN_PASSWORD), new Date().toISOString());
})();

/* ---------- Нууц үг: scrypt + санамсаргүй salt ---------- */
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return `s1:${salt}:${hash}`;
}

function verifyPassword(password, stored) {
    try {
        const [version, salt, hash] = String(stored).split(":");
        if (version !== "s1" || !salt || !hash) return false;
        const computed = crypto.scryptSync(String(password), salt, 64);
        const expected = Buffer.from(hash, "hex");
        return computed.length === expected.length && crypto.timingSafeEqual(computed, expected);
    } catch {
        return false;
    }
}

/* ============================================================
   Хэрэглэгчид + session
   ============================================================ */
function getSessionUser(request) {
    const cookies = parseCookies(request.headers.cookie || "");
    const token = cookies[SESSION_COOKIE];
    if (!token) return null;
    const row = db.prepare(`
        SELECT u.id, u.student_id, u.name, u.role, s.token, s.expires_at
        FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token = ?`).get(token);
    if (!row) return null;
    if (new Date(row.expires_at).getTime() < Date.now()) {
        db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
        return null;
    }
    return { id: row.id, token: row.token, studentId: row.student_id, name: row.name, role: row.role };
}

function createSession(userId) {
    const token = crypto.randomBytes(32).toString("hex");
    const now = new Date();
    db.prepare("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
        .run(token, userId, now.toISOString(), new Date(now.getTime() + SESSION_TTL_MS).toISOString());
    return token;
}

function parseCookies(header) {
    const out = {};
    header.split(";").forEach(part => {
        const index = part.indexOf("=");
        if (index > 0) out[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
    });
    return out;
}

function publicUser(user) {
    return user ? { name: user.name, studentId: user.studentId, role: user.role } : null;
}

/* ============================================================
   Туслах
   ============================================================ */
function sendJSON(response, status, payload, extraHeaders = {}) {
    const body = JSON.stringify(payload);
    response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...extraHeaders
    });
    response.end(body);
}

function setSessionCookie(token) {
    return { "Set-Cookie": `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}` };
}

function clearSessionCookie() {
    return { "Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0` };
}

function phoneNumberValid(phone) {
    const digits = String(phone || "").replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 11;
}

function isoDayStamp(date) {
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function generateOrderNumber() {
    const stamp = isoDayStamp(new Date());
    for (let attempt = 0; attempt < 200; attempt += 1) {
        const candidate = `HA-${stamp}-${Math.floor(100 + Math.random() * 900)}`;
        const exists = db.prepare("SELECT 1 FROM orders WHERE number = ?").get(candidate);
        if (!exists) return candidate;
    }
    /* Огноо + crypto fallback */
    return `HA-${stamp}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

function orderWithItems(row) {
    const items = db.prepare("SELECT food_id AS id, name, unit_price AS price, qty, line_total FROM order_items WHERE order_id = ? ORDER BY id").all(row.id);
    return {
        id: row.id,
        number: row.number,
        createdAt: row.created_at,
        status: row.status,
        studentId: row.student_id,
        userName: row.user_name,
        phone: row.phone,
        address: row.address,
        note: row.note,
        payment: row.payment,
        coupon: row.coupon,
        subtotal: row.subtotal,
        discount: row.discount,
        total: row.total,
        pickupSpot: row.pickup_spot,
        pickupDate: row.pickup_date,
        pickupTime: row.pickup_time,
        items: items.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty, lineTotal: item.line_total }))
    };
}

/* ============================================================
   API гарцууд
   ============================================================ */
async function handleAPI(request, response, pathname) {
    const method = request.method;
    const body = await readBody(request).catch(() => null);

    /* ---------- Нэвтрэлт ---------- */
    if (pathname === "/api/auth/register" && method === "POST") {
        return apiRegister(request, response, body);
    }
    if (pathname === "/api/auth/login" && method === "POST") {
        return apiLogin(request, response, body);
    }
    if (pathname === "/api/auth/logout" && method === "POST") {
        const user = getSessionUser(request);
        if (user) db.prepare("DELETE FROM sessions WHERE token = ?").run(user.token);
        return sendJSON(response, 200, { ok: true }, clearSessionCookie());
    }
    if (pathname === "/api/auth/me" && method === "GET") {
        const user = getSessionUser(request);
        return sendJSON(response, 200, { user: publicUser(user) });
    }

    /* ---------- Захиалга ---------- */
    if (pathname === "/api/orders" && method === "POST") {
        return apiCreateOrder(request, response, body);
    }
    if (pathname === "/api/orders" && method === "GET") {
        const user = getSessionUser(request);
        if (!user) return sendJSON(response, 401, { error: "Нэвтэрч орно уу." });
        const rows = db.prepare("SELECT * FROM orders WHERE student_id = ? ORDER BY created_at DESC, id DESC").all(user.studentId);
        return sendJSON(response, 200, { orders: rows.map(orderWithItems) });
    }
    if (pathname === "/api/orders/migrate" && method === "POST") {
        return apiMigrateOrders(request, response, body);
    }

    /* ---------- Админ ---------- */
    if (pathname.startsWith("/api/admin/")) {
        const admin = getSessionUser(request);
        if (!admin) return sendJSON(response, 401, { error: "Нэвтэрч орно уу." });
        if (admin.role !== "admin") return sendJSON(response, 403, { error: "Админ эрх шаардлагатай." });

        if (pathname === "/api/admin/orders" && method === "GET") {
            const statusFilter = new URL(request.url, "http://x").searchParams.get("status");
            const rows = statusFilter && ORDER_STATUSES.includes(statusFilter)
                ? db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC, id DESC").all(statusFilter)
                : db.prepare("SELECT * FROM orders ORDER BY created_at DESC, id DESC").all();
            return sendJSON(response, 200, { orders: rows.map(orderWithItems) });
        }

        if (pathname.startsWith("/api/admin/orders/") && pathname.endsWith("/status") && method === "PATCH") {
            const id = Number(pathname.split("/")[4]);
            const status = body && typeof body.status === "string" ? body.status : "";
            if (!Number.isInteger(id) || id <= 0) return sendJSON(response, 400, { error: "Захиалгын дугаар буруу байна." });
            if (!ORDER_STATUSES.includes(status)) return sendJSON(response, 400, { error: "Төлөвийн утга буруу байна." });
            const updated = db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
            if (updated.changes === 0) return sendJSON(response, 404, { error: "Захиалга олдсонгүй." });
            const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
            return sendJSON(response, 200, { order: orderWithItems(row) });
        }
        return sendJSON(response, 404, { error: "Олдсонгүй." });
    }

    /* ---------- Холбоо барих мэдэгдэл ---------- */
    if (pathname === "/api/messages" && method === "POST") {
        const name = String(body.name || "").trim();
        const contact = String(body.contact || "").trim();
        const message = String(body.message || "").trim();
        if (name.length < 2 || contact.length < 5 || message.length < 10) {
            return sendJSON(response, 400, { error: "Мэдэгдлийн мэдээлэл дутуу байна." });
        }
        db.prepare("INSERT INTO messages (name, contact, message, created_at) VALUES (?, ?, ?, ?)")
            .run(name, contact, message, new Date().toISOString());
        return sendJSON(response, 200, { ok: true });
    }

    return sendJSON(response, 404, { error: "API олдсонгүй." });
}

/* ---------- Нэвтрэлт, бүртгэл ---------- */
function checkStudentCodeFormat(code) {
    return /^[0-9A-Za-zА-Яа-яӨөҮүЁё\-]{4,16}$/.test(String(code || "").trim());
}

function apiRegister(request, response, body) {
    const surname = String(body.surname || "").trim().replace(/\s+/g, " ");
    const givenName = String(body.givenName || "").trim().replace(/\s+/g, " ");
    const studentId = String(body.studentId || "").trim();
    const password = String(body.password || "");
    const name = `${surname} ${givenName}`.trim();

    if (surname.length < 2 || givenName.length < 2) {
        return sendJSON(response, 400, { error: "Овог болон нэр хамгийн багадаа 2 тэмдэгт байх ёстой." });
    }
    if (studentId.length < 4 || studentId.length > 16 || !checkStudentCodeFormat(studentId)) {
        return sendJSON(response, 400, { error: "Оюутны код 4–16 тэмдэгт (үсэг, тоо) байх ёстой." });
    }
    if (password.length < 6) {
        return sendJSON(response, 400, { error: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой." });
    }
    const codeKey = studentId.toLowerCase();
    if (db.prepare("SELECT 1 FROM users WHERE student_id = ?").get(codeKey)) {
        return sendJSON(response, 409, { error: "Энэ оюутны кодоор бүртгэл үүссэн байна." });
    }
    const result = db.prepare("INSERT INTO users (student_id, name, password_hash, role, created_at) VALUES (?, ?, ?, 'student', ?)")
        .run(codeKey, name, hashPassword(password), new Date().toISOString());
    const token = createSession(result.lastInsertRowid);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
    return sendJSON(response, 201, { user: publicUser(user) }, setSessionCookie(token));
}

function apiLogin(request, response, body) {
    const code = String(body.studentId || "").trim().toLowerCase();
    const password = String(body.password || "");
    const user = db.prepare("SELECT * FROM users WHERE student_id = ?").get(code);
    if (!user || !verifyPassword(password, user.password_hash)) {
        return sendJSON(response, 401, { error: "Код эсвэл нууц үг буруу байна." });
    }
    const token = createSession(user.id);
    return sendJSON(response, 200, { user: publicUser(user) }, setSessionCookie(token));
}

/* ---------- Шинэ захиалга (давхар бүртгэлээс хамгаалсан) ---------- */
function apiCreateOrder(request, response, body) {
    const user = getSessionUser(request);
    if (!user) return sendJSON(response, 401, { error: "Захиалга өгөхийн тулд эхлээд нэвтэрч орно уу." });

    const clientToken = String(body.clientToken || "").trim();
    const itemsInput = Array.isArray(body.items) ? body.items : [];
    const phone = String(body.phone || "").trim();
    const note = String(body.note || "").trim().slice(0, 500);
    const pickupSpot = String(body.pickupSpot || "").trim().slice(0, 120);
    const pickupDate = String(body.pickupDate || "").trim();
    const pickupTime = String(body.pickupTime || "").trim();
    const payment = PAYMENT_METHODS.includes(body.payment) ? body.payment : "cash";
    const coupon = String(body.coupon || "").trim().toUpperCase();

    if (!clientToken) return sendJSON(response, 400, { error: "clientToken дутуу байна." });
    if (!itemsInput.length) return sendJSON(response, 400, { error: "Сагс хоосон байна." });
    if (!phoneNumberValid(phone)) return sendJSON(response, 400, { error: "Утасны дугаар буруу байна (8–11 цифр)." });
    if (!pickupSpot || !/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) return sendJSON(response, 400, { error: "Очих байр болон өдрийг зөв сонгоно уу." });
    if (!/^\d{2}:\d{2}$/.test(pickupTime)) return sendJSON(response, 400, { error: "Очих цагийг сонгоно уу." });

    /* Давхар бүртгэлийг хориглоно: ижил clientToken-тай захиалга бүртгэгдсэн бол түүнийг буцаана */
    const existing = db.prepare("SELECT id, number FROM orders WHERE client_token = ?").get(clientToken);
    if (existing) {
        const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(existing.id);
        return sendJSON(response, 200, { order: orderWithItems(row), duplicate: true });
    }

    /* Үнийг серверээс тооцно — клиенээс ирсэн үнийг хэрэглэдэггүй */
    const items = [];
    for (const item of itemsInput.slice(0, 50)) {
        const id = Number(item.id);
        const qty = Math.floor(Number(item.qty));
        const price = MENU_PRICES[id];
        if (!price || qty < 1 || qty > 20) return sendJSON(response, 400, { error: "Хоолны сонголт эсвэл тоо ширхэг буруу байна." });
        const duplicate = items.find(existingItem => existingItem.id === id);
        if (duplicate) {
            duplicate.qty = Math.min(20, duplicate.qty + qty);
            duplicate.lineTotal = duplicate.qty * price;
        } else {
            items.push({ id, name: String(item.name || "").slice(0, 120), price, qty, lineTotal: qty * price });
        }
    }
    if (!items.length) return sendJSON(response, 400, { error: "Сагс хоосон байна." });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const discountRate = COUPON_RATES[coupon] || 0;
    const discount = Math.round(subtotal * discountRate);
    const total = Math.max(0, subtotal - discount);
    const status = "Шинэ";

    const insertOrder = db.prepare(`
        INSERT INTO orders (
            number, client_token, user_id, student_id, user_name, phone, address, note,
            payment, coupon, subtotal, discount, total, pickup_spot, pickup_date, pickup_time, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const insertItem = db.prepare("INSERT INTO order_items (order_id, food_id, name, unit_price, qty, line_total) VALUES (?, ?, ?, ?, ?, ?)");

    let created;
    for (let attempt = 0; attempt < 3; attempt += 1) {
        const number = generateOrderNumber();
        try {
            const result = insertOrder.run(
                number, clientToken, user.id, user.studentId, user.name, phone,
                pickupSpot /* хүргэлтийн/очих хаяг */, note, payment, coupon,
                subtotal, discount, total, pickupSpot, pickupDate, pickupTime, status, new Date().toISOString()
            );
            const orderId = result.lastInsertRowid;
            items.forEach(item => insertItem.run(orderId, item.id, item.name, item.price, item.qty, item.lineTotal));
            created = orderId;
            break;
        } catch (error) {
            if (String(error.message || "").includes("UNIQUE")) {
                const again = db.prepare("SELECT id FROM orders WHERE client_token = ?").get(clientToken);
                if (again) {
                    const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(again.id);
                    return sendJSON(response, 200, { order: orderWithItems(row), duplicate: true });
                }
                continue; /* захиалгын дугаар давхардсан бол дахин үүсгэнэ */
            }
            throw error;
        }
    }
    if (!created) return sendJSON(response, 500, { error: "Захиалга хадгалахад алдаа гарлаа." });

    const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(created);
    return sendJSON(response, 201, { order: orderWithItems(row) });
}

/* ---------- Хуучин локал захиалгуудыг нэг удаа шилжүүлэх ---------- */
function apiMigrateOrders(request, response, body) {
    const user = getSessionUser(request);
    if (!user) return sendJSON(response, 401, { error: "Нэвтэрч орно уу." });
    const incoming = Array.isArray(body.orders) ? body.orders.slice(0, 100) : [];
    const inserted = { count: 0 };

    for (const raw of incoming) {
        const number = String(raw.number || "").trim().slice(0, 40);
        if (!number) continue;
        if (db.prepare("SELECT 1 FROM orders WHERE number = ?").get(number)) continue;

        const items = Array.isArray(raw.items) ? raw.items.slice(0, 50) : [];
        let subtotal = 0;
        const cleanItems = [];
        let valid = true;
        for (const item of items) {
            const id = Number(item.id);
            const qty = Math.floor(Number(item.qty));
            const price = Number(item.price);
            if (!price || qty < 1 || qty > 20) { valid = false; break; }
            cleanItems.push({ id, name: String(item.name || "").slice(0, 120), price, qty, lineTotal: Math.round(price * qty) });
        }
        if (!valid || !cleanItems.length) continue;

        subtotal = cleanItems.reduce((sum, item) => sum + item.lineTotal, 0);
        const discount = Math.max(0, Math.min(subtotal, Math.round(Number(raw.discount) || 0)));
        const total = Math.max(0, subtotal - discount) || Number(raw.total) || subtotal;
        const result = db.prepare(`
            INSERT OR IGNORE INTO orders (
                number, client_token, user_id, student_id, user_name, phone, address, note,
                payment, coupon, subtotal, discount, total, pickup_spot, pickup_date, pickup_time, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
            number, `migrated:${number}`, user.id, user.studentId, user.name,
            String(raw.phone || "").trim().slice(0, 20), String(raw.pickupSpot || "").slice(0, 120),
            String(raw.note || "").slice(0, 500), PAYMENT_METHODS.includes(raw.payment) ? raw.payment : "cash",
            String(raw.coupon || "").slice(0, 20), subtotal, discount, total,
            String(raw.pickupSpot || "").slice(0, 120), String(raw.pickupDate || "").slice(0, 20),
            String(raw.pickupTime || "").slice(0, 20),
            ORDER_STATUSES.includes(raw.status) ? raw.status : "Баталгаажсан",
            /^\d{4}-\d{2}-\d{2}T/.test(String(raw.createdAt)) ? String(raw.createdAt) : new Date().toISOString()
        );
        if (result.changes > 0) {
            inserted.count += 1;
            const orderId = db.prepare("SELECT id FROM orders WHERE number = ?").get(number).id;
            cleanItems.forEach(item => db.prepare("INSERT INTO order_items (order_id, food_id, name, unit_price, qty, line_total) VALUES (?, ?, ?, ?, ?, ?)")
                .run(orderId, item.id, item.name, item.price, item.qty, item.lineTotal));
        }
    }
    return sendJSON(response, 200, { migrated: inserted.count });
}

/* ============================================================
   Статик файл үйлчилгээ
   ============================================================ */
const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2"
};

function readBody(request) {
    return new Promise((resolve, reject) => {
        let size = 0;
        const chunks = [];
        request.on("data", chunk => {
            size += chunk.length;
            if (size > 1024 * 1024) {
                reject(new Error("Body too large"));
                request.destroy();
                return;
            }
            chunks.push(chunk);
        });
        request.on("end", () => {
            if (!chunks.length) return resolve({});
            try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
            catch { resolve({}); }
        });
        request.on("error", reject);
    });
}

function serveFile(request, response, pathname) {
    const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    let filePath = path.join(ROOT, safePath);
    if (!filePath.startsWith(ROOT)) {
        response.writeHead(403);
        return response.end("Forbidden");
    }
    if (pathname === "/" || pathname === "") filePath = path.join(ROOT, "index.html");
    fs.stat(filePath, (error, stats) => {
        if (error || !stats.isFile()) {
            response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            response.end("<!DOCTYPE html><html lang=\"mn\"><meta charset=\"utf-8\"><title>404</title><body style=\"font-family:sans-serif;padding:60px\"><h1>404 — Хуудас олдсонгүй</h1><p><a href=\"/\">Нүүр хуудас руу буцах</a></p></body></html>");
            return;
        }
        response.writeHead(200, {
            "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
            "Cache-Control": "no-cache"
        });
        fs.createReadStream(filePath).pipe(response);
    });
}

const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent((request.url || "/").split("?")[0]);
    if (pathname.startsWith("/api/")) {
        handleAPI(request, response, pathname).catch(error => {
            console.error("API алдаа:", error);
            if (!response.headersSent) sendJSON(response, 500, { error: "Серверийн дотоод алдаа." });
        });
        return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405);
        return response.end("Method Not Allowed");
    }
    serveFile(request, response, pathname);
});

server.listen(PORT, () => {
    console.log(`ХААИС сервер http://localhost:${PORT} дээр ажиллаж байна.`);
    console.log(`Админ бүртгэл: код "${ADMIN_CODE}" (нууц үг environment · ADMIN_PASSWORD-ээр тохируулна)`);
});
