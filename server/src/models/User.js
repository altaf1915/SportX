import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const sports = ["Football", "Cricket", "Basketball", "Volleyball", "Badminton", "Kabaddi", "Tennis", "Baseball", "Formula 1", "Olympics", "Esports", "Running", "Chess", "Carrom", "Table Tennis"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"]
    },
    password: { type: String, minlength: 8, select: false },
    googleId: String,
    role: { type: String, enum: ["user", "admin", "coach", "player", "moderator"], default: "user" },
    avatar: { url: String, publicId: String },
    sportsInterests: [{ type: String, enum: sports }],
    skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Pro"], default: "Beginner" },
    bio: { type: String, maxlength: 500 },
    city: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }
    },
    availability: [{ day: String, slots: [String] }],
    age: { type: Number, min: 13, max: 90 },
    gender: { type: String, enum: ["Female", "Male", "Non-binary", "Prefer not to say"] },
    rating: { average: { type: Number, default: 5 }, count: { type: Number, default: 0 } },
    fairPlayScore: { type: Number, default: 95 },
    trustScore: { type: Number, default: 80 },
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "suspended", "deleted"], default: "active" },
    otp: { code: String, expiresAt: Date },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });
userSchema.index({ name: "text", city: "text", sportsInterests: "text" });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export { sports };
export default mongoose.model("User", userSchema);
