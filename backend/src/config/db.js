import mongoose from "mongoose";

// Cache the connection on the global object so warm serverless invocations
// reuse it instead of opening a new connection on every request.
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not defined in .env");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000 })
      .then((m) => {
        console.log(`✅  MongoDB connected: ${m.connection.host}/${m.connection.name}`);
        return m;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
