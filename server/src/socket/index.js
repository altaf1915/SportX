import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function registerSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("name avatar role");
      if (!user) return next(new Error("Unauthorized"));
      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id}`);

    socket.on("conversation:join", (conversationId) => {
      socket.join(String(conversationId));
    });

    socket.on("typing:start", ({ conversationId }) => {
      socket.to(String(conversationId)).emit("typing:start", { user: socket.user });
    });

    socket.on("typing:stop", ({ conversationId }) => {
      socket.to(String(conversationId)).emit("typing:stop", { user: socket.user._id });
    });
  });
}
