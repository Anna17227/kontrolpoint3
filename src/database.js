const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const databasePath = path.join(__dirname, '..', 'data', 'app.db');

const db = new sqlite3.Database(databasePath);

const seedUsers = [
  { name: 'Иван Иванов', email: 'ivan@example.com' },
  { name: 'Анна Петрова', email: 'anna@example.com' },
  { name: 'Павел Смирнов', email: 'pavel@example.com' },
];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        id: this.lastID,
        changes: this.changes,
      });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function initDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  const result = await get('SELECT COUNT(*) AS count FROM users');

  if (result.count === 0) {
    for (const user of seedUsers) {
      await createUser(user);
    }
  }
}

function getUsers() {
  return all('SELECT id, name, email FROM users ORDER BY id ASC');
}

function getUserById(id) {
  return get('SELECT id, name, email FROM users WHERE id = ?', [id]);
}

function createUser(user) {
  return run(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [user.name, user.email]
  );
}

function updateUser(id, user) {
  return run(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [user.name, user.email, id]
  );
}

function deleteUser(id) {
  return run('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = {
  initDatabase,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
