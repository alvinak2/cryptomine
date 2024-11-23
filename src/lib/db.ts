// src/lib/db.ts
import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to .env.local')
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: Cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    console.log('Using cached connection')
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      retryWrites: true,
      maxPoolSize: 10,
    }

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('New database connection established')
        return mongoose
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error)
        cached.promise = null
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    cached.promise = null
    throw error
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (cached.conn) {
    await cached.conn.disconnect()
    console.log('MongoDB disconnected')
    process.exit(0)
  }
})