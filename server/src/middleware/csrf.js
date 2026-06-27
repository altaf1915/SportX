import crypto from "crypto";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function csrfToken(req, res) {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie("csrfToken", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 1000
  });
  res.json({ csrfToken: token });
}

export function csrfGuard(req, res, next) {
  const usesBearer = req.headers.authorization?.startsWith("Bearer ");
  if (!unsafeMethods.has(req.method) || usesBearer || !req.cookies?.token) return next();

  const headerToken = req.headers["x-csrf-token"];
  if (!headerToken || headerToken !== req.cookies.csrfToken) {
    res.status(403);
    return next(new Error("CSRF token missing or invalid"));
  }
  next();
}
