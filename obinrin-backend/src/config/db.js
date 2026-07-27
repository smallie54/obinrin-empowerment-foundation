import "dotenv/config";
import dns from "dns";

// Some networks/ISPs block or mishandle SRV DNS lookups, which Mongoose
// needs for mongodb+srv:// connection strings. Forcing Node's resolver
// to use Google's public DNS works around that.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
// ...rest of your imports unchanged

import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}