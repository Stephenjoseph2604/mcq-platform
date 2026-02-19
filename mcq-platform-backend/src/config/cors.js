import cors from "cors";

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / Postman / mobile apps
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS blocked for origin: ${origin}`),
      false
    );
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With"
  ],

  exposedHeaders: ["Authorization"],

//   credentials: true, // 🔥 required for JWT cookies

  maxAge: 86400, // 24 hours preflight cache

  optionsSuccessStatus: 204
};

export default cors(corsOptions);
