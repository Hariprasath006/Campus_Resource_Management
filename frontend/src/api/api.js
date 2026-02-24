import axios from "axios";

const API = axios.create({
  baseURL: "https://campus-resource-management-co8g.onrender.com/api"
});

/* AUTH */
export const login = (data) => API.post("/auth/login", data);

/* USERS */
export const getUsers = () => API.get("/users");
export const createUser = (data) => API.post("/users", data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

/* RESOURCES */
export const getResources = () => API.get("/resources");
export const createResource = (data) => API.post("/resources", data);
export const deleteResource = (id) => API.delete(`/resources/${id}`);

/* BOOKINGS */
export const getBookings = () => API.get("/bookings");
export const createBooking = (data) => API.post("/bookings", data);
export const updateBookingStatus = (id, status) =>
  API.put(`/bookings/${id}/status`, { status });

export default API;
