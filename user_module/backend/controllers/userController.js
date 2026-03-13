const { pool } = require("../config/db");

// Create user
const createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const [result] = await pool.query(
      "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
      [name, email, phone]
    );
    res.status(201).json({ id: result.insertId, name, email, phone });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email, phone, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ id: Number(req.params.id), name, email, phone });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
