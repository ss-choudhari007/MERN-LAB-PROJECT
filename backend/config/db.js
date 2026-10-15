import mongoose from "mongoose";

let mongoServerInstance = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopkart";

  try {
    // Attempt connecting to the configured URI with a 10s server selection timeout for Atlas
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000,
    });
    const maskedUri = primaryUri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
    console.log(`✅ MongoDB connected successfully to ${maskedUri}`);
  } catch (primaryErr) {
    console.warn(`⚠️ Could not connect to primary MongoDB (${primaryUri}): ${primaryErr.message}`);
    console.log("🔄 Initializing embedded MongoMemoryServer for standalone zero-config execution...");

    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongoServerInstance = await MongoMemoryServer.create();
      const memoryUri = mongoServerInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ Connected to Embedded MongoDB at ${memoryUri}`);
    } catch (memErr) {
      console.error("❌ Fatal: Failed to initialize database:", memErr.message);
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoServerInstance) {
    await mongoServerInstance.stop();
  }
};
