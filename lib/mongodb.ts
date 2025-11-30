import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectionDB(){
    console.log('MONGODB_URI exists:', !!MONGODB_URI);
    
    if(cached.conn){
        console.log('Using cached connection');
        return cached.conn
    }

    if (!cached.promise) {
        console.log('Creating new connection...');
        const opts = {
          bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
          console.log('Mongoose connected successfully');
          return mongoose;
        }).catch((err) => {
          console.error('Mongoose connection error:', err);
          throw err;
        });
    }
    
    try {
        cached.conn = await cached.promise;
        console.log('Connection established');
    } catch (e) {
        console.error('Failed to establish connection:', e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}