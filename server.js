const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the current directory
app.use(express.static(__dirname));

// Game state
const players = new Map(); // id -> { id, x, y, z, pitch, yaw }
const worldBlocks = new Map(); // "x,y,z" -> type (0 for air/removed)

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).substr(2, 9);

  const player = {
    id,
    x: 0,
    y: 50,
    z: 0,
    pitch: 0,
    yaw: 0
  };

  players.set(id, player);

  // Send initial state to the new player
  ws.send(JSON.stringify({
    type: 'init',
    id: id,
    players: Array.from(players.values()).filter(p => p.id !== id),
    blocks: Array.from(worldBlocks.entries())
  }));

  // Broadcast new player to others
  broadcast({
    type: 'player_join',
    player: player
  }, ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'player_move':
          if (players.has(id)) {
            const p = players.get(id);
            p.x = data.x;
            p.y = data.y;
            p.z = data.z;
            p.pitch = data.pitch;
            p.yaw = data.yaw;

            // Forward movement to others
            broadcast({
              type: 'player_move',
              id: id,
              x: data.x,
              y: data.y,
              z: data.z,
              pitch: data.pitch,
              yaw: data.yaw
            }, ws);
          }
          break;

        case 'block_placed':
          worldBlocks.set(`${data.x},${data.y},${data.z}`, data.blockType);
          broadcast({
            type: 'block_placed',
            id: id,
            x: data.x,
            y: data.y,
            z: data.z,
            blockType: data.blockType
          }, ws);
          break;

        case 'block_broken':
          worldBlocks.set(`${data.x},${data.y},${data.z}`, 0); // 0 is AIR
          broadcast({
            type: 'block_broken',
            id: id,
            x: data.x,
            y: data.y,
            z: data.z
          }, ws);
          break;
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  });

  ws.on('close', () => {
    players.delete(id);
    broadcast({
      type: 'player_leave',
      id: id
    });
  });
});

function broadcast(data, excludeWs = null) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
