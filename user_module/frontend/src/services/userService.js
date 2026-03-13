const API = "http://localhost:5000/api/users";

export const userService = {
  getAll: () => fetch(API).then((res) => res.json()),

  getById: (id) => fetch(`${API}/${id}`).then((res) => res.json()),

  create: (data) =>
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  update: (id, data) =>
    fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  delete: (id) =>
    fetch(`${API}/${id}`, { method: "DELETE" }).then((res) => res.json()),
};
