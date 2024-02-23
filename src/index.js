// packages
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import userRouter from "./routes/user/user.routes.js";
import astrologerRouter from "./routes/astrologer/astrologer.routes.js";
import adminRouter from "./routes/admin/admin.routes.js";
import { Server } from "socket.io";
import { nodeClusterizer } from "./middlewares/clusterizer.middlewares.js";
import globalRouter from "./routes/global/global.routes.js";

// constants and config

async function main() {
  try {
    const app = express();
    const server = createServer(app);
    dotenv.config();
    const PRIMARY_PORT = process.env.PRIMARY_PORT || 3009
    // CORS CONFIG
    app.use(
      cors({
        origin: "*",
        methods: ["GET, POST, PUT, DELETE"],
        credentials: true,
      })
    );

    // EXPRESS JSON BODY PARSER
    app.use(express.json());

    // ROUTES FOR USER
    app.use("/user", userRouter);

    // ROUTES FOR ASTROLOGER
    app.use("/astrologer", astrologerRouter);

    // ROUTES FOR ADMIN
    app.use("/admin", adminRouter);

    // ROUTES FOR GLOBAL
    app.use("/global", globalRouter)

    // Listener
    server.listen(PRIMARY_PORT, () => {
      console.log(
        `Server is running on port http://localhost:${PRIMARY_PORT}`
      );
    });

    // Routes
    app.get("/", (req, res) => {
      try {
        res.send("SERVER ONLINE !!!");
      } catch (error) {
        res.status(500).send("INTERNAL SERVER ERROR !!!")
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// main function invocation with node clusterization for multithreading
nodeClusterizer(main);
