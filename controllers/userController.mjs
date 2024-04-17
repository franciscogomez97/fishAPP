import { openDb } from '../database/userDB/databaseUserCon.mjs';
import bcrypt from 'bcrypt';

// Hash const
const SALT_ROUNDS = 10;

// Register user
async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;
        const db = await openDb();

        // Hash
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert user data
        const result = await db.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, passwordHash]);

        res.status(201).send({ success: 'User registered', id: result.lastID });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const db = await openDb();
        
        // Search user
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Password verification
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        res.send({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

async function getUserData(req, res) {
    const db = await openDb();
    try {
        let userId = req.user.id;

        // Check if user is admin
        if (req.user.is_admin && req.params.id) {
            userId = req.params.id;
        }

        const user = await db.get(`SELECT id, username, email, created_at FROM users WHERE id = ?`, [userId]);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

async function patchUserData(req, res) {
    try {
        const { username, email } = req.body;
        const db = await openDb();
        const fieldsToUpdate = [];
        const values = [];

        if (username !== undefined) {
            fieldsToUpdate.push('username = ?');
            values.push(username);
        }

        if (email !== undefined) {
            fieldsToUpdate.push('email = ?');
            values.push(email);
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).send('No update fields provided');
        }

        values.push(req.user.id);

        await db.run(`UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?', values`);

        res.send('User updated successfully');
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

async function changeUserPassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;
        const db = await openDb();

        // Get the actual hashed password and compare
        const { password_hash } = await db.get('SELECT password_hash FROM users WHERE id = ?', [userId]);
        const isMatch = await bcrypt.compare(oldPassword, password_hash);
        if (!isMatch) {
            return res.status(401).send('La contraseña actual es incorrecta.');
        }
        // Hash the new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, userId]);
        res.send('Your password has been changed.');
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

async function deleteUser(req, res) {
    try {
        const db = await openDb();

        // Delete user
        await db.run('DELETE FROM users WHERE id = ?', [req.user.id]);
        
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export { registerUser, loginUser, getUserData, patchUserData, deleteUser, changeUserPassword };