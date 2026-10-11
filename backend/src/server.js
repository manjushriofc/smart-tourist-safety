import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import touristRoutes from './routes/touristRoutes.js';
import zoneRoutes from './routes/zoneRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import demoRoutes from './routes/demoRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import digitalIdRoutes from './routes/digitalIdRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { initSocketService } from './services/socketService.js';
import { store } from './data/inMemoryStore.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// Initialize Socket Service
initSocketService(io);

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);           // Auth: /login, /register, /me
app.use('/api/tourists', touristRoutes);
app.use('/api/locations', touristRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/geofence', zoneRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/demo', demoRoutes);           // Admin test & demo triggers
app.use('/api/ai', aiRoutes);               // AI risk calculation
app.use('/api/digital-id', digitalIdRoutes); // Digital ID generate & verify
app.use('/api/ledger', ledgerRoutes);       // Tamper-evident chained ledger

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Smart Tourist Safety Command Backend',
    timestamp: new Date().toISOString(),
    kpi: store.getKpiStats(),
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Smart Tourist Safety Backend Running on Port ${PORT}`);
  console.log(`📡 Socket.IO Real-Time Telemetry Service Initialized`);
  console.log(`🤖 AI Contextual Safety Risk Engine Bridge Connected`);
  console.log(`🔒 Digital ID & Tamper-Evident Audit Ledger Initialized`);
  console.log(`🛡 Role-Based Authentication & Geolocation Enabled`);
  console.log(`🔗 REST API Root: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
