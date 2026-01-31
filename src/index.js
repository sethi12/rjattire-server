import express from "express";
import cors from "cors";

import adminRoutes from "./routes/admin.routes.js";
import clientRoutes from "./routes/client.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://rj-attire-admin.vercel.app",
      "https://rjattires.in",
      "https://rj-attires.vercel.app", // optional
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 VERY IMPORTANT (preflight support)
app.options("*", cors());

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
