const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Krish@2007',
    database: 'beatbox_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL Database (beatbox_db).');
});

// ================================================
// CREATE — Register a new user
// ================================================
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Please fill in all fields.' });
    }

    if (password.length < 6) {
        return res.json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error('REGISTER ERROR:', err.message);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({ success: false, message: 'An account with this email already exists.' });
            }
            return res.json({ success: false, message: `Database error: ${err.message}` });
        }
        res.json({ success: true, message: 'Account created successfully!' });
    });
});

// ================================================
// READ — Login (check credentials)
// ================================================
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Entered Email:', `"${email}"`);

    if (!email || !password) {
        return res.json({ success: false, message: 'Please fill in all fields.' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('SQL QUERY ERROR:', err.message);
            return res.json({ success: false, message: 'Database error.' });
        }

        console.log('Rows found in MySQL:', results.length);

        if (results.length === 0) {
            console.log('REASON: Email was not found in MySQL table.');
            return res.json({ success: false, message: 'Wrong email or password.' });
        }

        const user = results[0];

        if (user.password === password) {
            console.log('SUCCESS: Passwords Match!');
            res.json({ success: true, message: `Welcome back, ${user.name}!` });
        } else {
            console.log('REASON: Passwords do not match!');
            res.json({ success: false, message: 'Wrong email or password.' });
        }
    });
});

// ================================================
// UPDATE — Change password
// ================================================
app.post('/update-password', (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return res.json({ success: false, message: 'Please fill in all fields.' });
    }

    if (newPassword.length < 6) {
        return res.json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const checkSql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(checkSql, [email, oldPassword], (err, results) => {
        if (err) {
            console.error('UPDATE CHECK ERROR:', err.message);
            return res.json({ success: false, message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.json({ success: false, message: 'Current email or password is incorrect.' });
        }

        const updateSql = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(updateSql, [newPassword, email], (err, result) => {
            if (err) {
                console.error('UPDATE ERROR:', err.message);
                return res.json({ success: false, message: 'Database error.' });
            }
            res.json({ success: true, message: 'Password updated successfully!' });
        });
    });
});

// ================================================
// DELETE — Delete account
// ================================================
app.post('/delete-account', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Please fill in all fields.' });
    }

    const checkSql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(checkSql, [email, password], (err, results) => {
        if (err) {
            console.error('DELETE CHECK ERROR:', err.message);
            return res.json({ success: false, message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.json({ success: false, message: 'Email or password is incorrect.' });
        }

        const deleteSql = 'DELETE FROM users WHERE email = ?';
        db.query(deleteSql, [email], (err, result) => {
            if (err) {
                console.error('DELETE ERROR:', err.message);
                return res.json({ success: false, message: 'Database error.' });
            }
            res.json({ success: true, message: 'Account deleted.' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});