const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch (e) {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  base: BASE,
  health: () => request("/health"),

  // Batches
  listBatches: () => request("/batches"),
  getBatch: (id) => request(`/batches/${id}`),
  createBatch: (data) =>
    request("/batches", { method: "POST", body: JSON.stringify(data) }),
  updateBatch: (id, data) =>
    request(`/batches/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBatch: (id) => request(`/batches/${id}`, { method: "DELETE" }),

  // Fermentation logs
  getLogs: (batchId) => request(`/batches/${batchId}/logs`),
  addLog: (batchId, data) =>
    request(`/batches/${batchId}/logs`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteLog: (batchId, logId) =>
    request(`/batches/${batchId}/logs/${logId}`, { method: "DELETE" }),
};
