import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import Match from "../models/Match.js";
import Community from "../models/Community.js";

const adminEmail = "admin@sportx.local";
const playerEmail = "player@sportx.local";

async function seed() {
  await connectDB();

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "SportX Admin",
      email: adminEmail,
      password: "Admin@12345",
      role: "admin",
      city: "Bengaluru",
      sportsInterests: ["Football", "Cricket"],
      isVerified: true,
      isPremium: true
    });
  }

  let player = await User.findOne({ email: playerEmail });
  if (!player) {
    player = await User.create({
      name: "Test Player",
      email: playerEmail,
      password: "Player@12345",
      role: "player",
      city: "Mumbai",
      sportsInterests: ["Badminton", "Tennis"],
      skillLevel: "Intermediate",
      isVerified: true
    });
  }

  await Match.findOneAndUpdate(
    { title: "Seeded Friday Football" },
    {
      title: "Seeded Friday Football",
      sport: "Football",
      creator: admin._id,
      players: [admin._id, player._id],
      maxPlayers: 10,
      startsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      venue: { name: "SportX Arena", city: "Bengaluru" },
      status: "open"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Community.findOneAndUpdate(
    { name: "SportX Founders Club" },
    {
      name: "SportX Founders Club",
      sport: "Football",
      description: "Seeded community for validating posts, events, and tournament flows.",
      city: "Bengaluru",
      owner: admin._id,
      moderators: [admin._id],
      members: [admin._id, player._id]
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Seed complete");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
