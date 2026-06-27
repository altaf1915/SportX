import mongoose from "mongoose";

const groundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    kind: { type: String, enum: ["ground", "court", "indoor-center"], required: true },
    sports: [String],
    address: String,
    city: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }
    },
    rating: { type: Number, default: 4.5 },
    amenities: [String],
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

groundSchema.index({ location: "2dsphere" });
groundSchema.index({ name: "text", city: "text", sports: "text" });

export default mongoose.model("Ground", groundSchema);
