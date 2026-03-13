import { useState, useEffect } from "react";
import { userService } from "./services/userService";
import "./App.css";

function App() {

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load Users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and Email are required");
      return;
    }

    try {
      if (editingId) {
        await userService.update(editingId, form);
        setEditingId(null);
      } else {
        await userService.create(form);
      }

      setForm({
        name: "",
        email: "",
        phone: ""
      });

      await loadUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingId(user.id);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || ""
    });
  };

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await userService.delete(id);
      await loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      phone: ""
    });
  };

  return (
    <div className="app">
      <h1>User Dashboard</h1>

      <form className="user-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit User" : "Add User"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <div className="form-buttons">
          <button type="submit">
            {editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="user-list">
        <h2>All Users</h2>

        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "-"}</td>

                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}

export default App;