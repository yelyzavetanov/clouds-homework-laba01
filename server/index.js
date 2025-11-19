require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

const {
    DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT, SESSION_SECRET
} = process.env;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306,
});

const sessionStore = new MySQLStore({}, pool);

app.use(session({
    key: 'sid',
    secret: SESSION_SECRET || 'dev-secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

// CSRF middleware
app.use(csurf({
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict'
    }
}));

// Route to provide CSRF token to React
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

function requireAuth(req, res, next) {
    if (req.session && req.session.userId) return next();
    return res.status(401).json({ error: 'Unauthorized' });
}

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length) return res.status(409).json({ error: 'User exists' });

        const hash = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', [email, hash, name || null]);
        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Missing' });

        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!rows.length) return res.status(401).json({ error: 'Invalid' });

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ error: 'Invalid' });

        req.session.userId = user.id;
        req.session.userEmail = user.email;
        req.session.regenerate(err => {
            if (err) console.error('session regenerate err', err);
            req.session.userId = user.id;
            req.session.userEmail = user.email;
            res.json({ success: true });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/profile', requireAuth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = ?', [req.session.userId]);
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        res.json({ user: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Could not logout' });
        res.clearCookie('sid'); // назва cookie у налаштуваннях session.key
        res.json({ success: true });
    });
});

// CSRF error handler
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') return res.status(403).json({ error: 'Invalid CSRF token' });
    next(err);
});

app.listen(PORT || 4000, () => console.log(`Server running on ${PORT || 4000}`));
