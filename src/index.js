import express from "express";
import cors from "cors";

import adminRoutes from "./routes/admin.routes.js";
import clientRoutes from "./routes/client.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
