import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const CompanyAPI = {
  list: () => api.get("/companies").then((r) => r.data),
  get: (id) => api.get(`/companies/${id}`).then((r) => r.data),
  create: (data) => api.post("/companies", data).then((r) => r.data),
  update: (id, data) => api.put(`/companies/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/companies/${id}`).then((r) => r.data),
};

export const ClientAPI = {
  list: (q) => api.get("/clients", { params: q ? { q } : {} }).then((r) => r.data),
  get: (id) => api.get(`/clients/${id}`).then((r) => r.data),
  create: (data) => api.post("/clients", data).then((r) => r.data),
  update: (id, data) => api.put(`/clients/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/clients/${id}`).then((r) => r.data),
};

export const InvoiceAPI = {
  list: (params) => api.get("/invoices", { params }).then((r) => r.data),
  get: (id) => api.get(`/invoices/${id}`).then((r) => r.data),
  nextNumber: () => api.get("/invoices/next-number").then((r) => r.data),
  create: (data) => api.post("/invoices", data).then((r) => r.data),
  update: (id, data) => api.put(`/invoices/${id}`, data).then((r) => r.data),
  setStatus: (id, status) => api.patch(`/invoices/${id}/status`, { status }).then((r) => r.data),
  remove: (id) => api.delete(`/invoices/${id}`).then((r) => r.data),
};

export default api;
