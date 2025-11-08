import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";
import { storage } from "./supabaseStorage";
import crypto from "crypto";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

const isProduction = process.env.NODE_ENV === 'production';
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  if (isProduction) {
    console.error('FATAL: SESSION_SECRET environment variable is required in production. Server will not start.');
    process.exit(1);
  } else {
    console.warn('⚠️  WARNING: SESSION_SECRET not set. Using auto-generated secret for development.');
    console.warn('⚠️  For production, set SESSION_SECRET environment variable to a secure random string.');
  }
}

const sessionSecret = SESSION_SECRET || crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  name: 'rutgers.chess.session',
  proxy: isProduction,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/'
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const sessionInfo = {
      hasSession: !!req.session,
      sessionID: req.sessionID,
      hasAdminId: !!req.session?.adminId,
      adminId: req.session?.adminId || null
    };
    console.log(`[Session Debug] ${req.method} ${req.path}:`, JSON.stringify(sessionInfo));
  }
  next();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.type === 'entity.too.large') {
    console.error('[Error] PayloadTooLargeError:', err.message);
    return res.status(413).json({
      error: 'Payload too large',
      message: 'The request payload exceeds the maximum allowed size (10MB)',
      limit: err.limit
    });
  }
  console.error('[Error] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

(async () => {
  await storage.seedData();

  registerRoutes(app);
  const server = await setupVite(app);

  const PORT = 5000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`Session configuration:`, {
      secret: SESSION_SECRET ? 'SET' : 'AUTO-GENERATED',
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: '7 days',
      proxy: isProduction
    });
    console.log(`Supabase URL: ${process.env.SUPABASE_URL ? 'SET' : 'MISSING'}`);
    console.log(`Supabase Key: ${process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}`);
  });
})();
