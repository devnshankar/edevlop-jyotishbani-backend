// packages
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import userRouter from "./routes/user/user.routes.js";
import astrologerRouter from "./routes/astrologer/astrologer.routes.js";
import adminRouter from "./routes/admin/admin.routes.js";
import { Server } from "socket.io";

// constants and config
const app = express();
const server = createServer(app);
dotenv.config();
const PORT = process.env.PORT;
// CORS CONFIG
app.use(
  cors({
    origin: "*",
    methods: ["GET, POST"],
    credentials: true,
  })
);

// EXPRESS JSON BODY PARSER
app.use(express.json());

// ROUTES FOR USER
app.use("/user", userRouter)

// ROUTES FOR ASTROLOGER
app.use("/astrologer", astrologerRouter)

// ROUTES FOR ADMIN
app.use("/admin", adminRouter)

async function main() {
  try {
      // Listener
      server.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`)
      })

      // Routes
      app.get("/" , (req, res) => {
        res.send("Welcome to Root")
      })


      
  } catch (error) {
    console.log(error);
  }
}

// main function invocation
main();

