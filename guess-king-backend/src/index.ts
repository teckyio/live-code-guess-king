import express from 'express'
import http from 'http'
import cors from 'cors';
import crypto from 'crypto'
import { Server, Socket } from 'socket.io'
import { createClient } from 'redis';
import 'dotenv/config'

const app = express()
app.use(cors({
  origin: process.env.REACT_FRONTEND_URL!
}))

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_FRONTEND_URL!,
    methods: ["GET", "POST"]
  }
})
const redis = createClient()

declare module 'socket.io' {
  interface Socket {
    uuid: string;
  }
}

async function getPlayer(uuid: string | null) {
  return uuid != null ? {
    id: uuid,
    name: await redis.hGet('guess:player:names', uuid) // O(1)
  } : null
}

io.on('connection', (socket) => {
  socket.on('join', async (name) => {
    if (socket.uuid != null) {
      return;
    }

    socket.uuid = crypto.randomUUID();
    const queueLength = await redis.rPush('guess:queue', socket.uuid) // O(1)
    await redis.hSet('guess:player:names', socket.uuid, name) // O(1)

    socket.emit('queued', {
      uuid: socket.uuid,
      name: name,
      currentPosition: queueLength,
      queue: await Promise.all((await redis.lRange('guess:queue', 0, 5)).map(uuid => getPlayer(uuid))),
    })

    socket.broadcast.emit('new-player', {
      id: socket.uuid,
      name: name,
    })
  })
})


redis.connect().then(() => {
  server.listen(8080, () => {
    console.log('Listening on *:8080')
  })
})