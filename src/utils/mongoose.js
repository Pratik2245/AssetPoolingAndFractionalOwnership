import mongoose from "mongoose";

// const MONGODB_URI = "mongodb+srv://hrushitech51:gJhfiZl1up3KHwHz@cluster0.rtla2uf.mongodb.net/APFOS";
// const MONGODB_URI = "mongodb://127.0.0.1:27017/AssestPooling";
// const MONGODB_URI = "mongodb://APFOS35:UKV8CAgcn9q6Q6dM@ac-7uxgfia-shard-00-00.xiofc4d.mongodb.net:27017,ac-7uxgfia-shard-00-01.xiofc4d.mongodb.net:27017,ac-7uxgfia-shard-00-02.xiofc4d.mongodb.net:27017/?replicaSet=atlas-zqazy8-shard-0&ssl=true&authSource=admin";
const MONGODB_URI = "mongodb://localhost:27017/AssetPolling";
if (!MONGODB_URI) {
  throw new Error("please define evn variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { con: null, promise: null };
}

const dbconnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default dbconnect;
