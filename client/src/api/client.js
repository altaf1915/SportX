import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "csrfToken",
  xsrfHeaderName: "X-CSRF-Token"
});

const unsafeMethods = new Set(["post", "put", "patch", "delete"]);
let csrfRequest;

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("sportx_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (unsafeMethods.has(config.method?.toLowerCase()) && !config.headers["X-CSRF-Token"]) {
    csrfRequest ||= api.get("/csrf-token").finally(() => {
      csrfRequest = null;
    });
    const { data } = await csrfRequest;
    config.headers["X-CSRF-Token"] = data.csrfToken;
  }

  return config;
});

export const demo = {
  players: [
    { _id: "1", name: "Aarav Mehta", city: "Bengaluru", sportsInterests: ["Football", "Running"], skillLevel: "Advanced", rating: { average: 4.9 }, trustScore: 96, isVerified: true, availability: [{ day: "Sat", slots: ["6 AM", "7 PM"] }] },
    { _id: "2", name: "Nisha Rao", city: "Mumbai", sportsInterests: ["Chess", "Table Tennis"], skillLevel: "Pro", rating: { average: 5 }, trustScore: 98, isVerified: true, availability: [{ day: "Sun", slots: ["4 PM"] }] },
    { _id: "3", name: "Kabir Sethi", city: "Delhi", sportsInterests: ["Cricket", "Basketball"], skillLevel: "Intermediate", rating: { average: 4.7 }, trustScore: 89, isVerified: false, availability: [{ day: "Wed", slots: ["8 PM"] }] }
  ],
  matches: [
    { _id: "m1", title: "5v5 Floodlight Football", sport: "Football", startsAt: new Date(Date.now() + 86400000).toISOString(), venue: { name: "Sky Turf Arena", city: "Bengaluru" }, players: [{ name: "Aarav" }, { name: "Riya" }], maxPlayers: 10, price: 199, status: "open" },
    { _id: "m2", title: "Sunday Chess Ladder", sport: "Chess", startsAt: new Date(Date.now() + 172800000).toISOString(), venue: { name: "Checkmate Cafe", city: "Mumbai" }, players: [{ name: "Nisha" }], maxPlayers: 16, price: 0, status: "open" }
  ],
  communities: [
    { _id: "c1", name: "Bengaluru Runners Club", sport: "Running", city: "Bengaluru", members: new Array(280), description: "Early morning runs, weekend long routes, and beginner-friendly pacing." },
    { _id: "c2", name: "Indoor Kings", sport: "Carrom", city: "Delhi", members: new Array(96), description: "Weekly carrom nights and friendly local tournaments." }
  ]
};

export const sportsList = ["Football", "Cricket", "Basketball", "Volleyball", "Badminton", "Kabaddi", "Tennis", "Baseball", "Formula 1", "Olympics", "Esports", "Running", "Chess", "Carrom", "Table Tennis"];
