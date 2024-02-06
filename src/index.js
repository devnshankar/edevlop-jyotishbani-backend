// packages
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";

// constants and config
const app = express();
const server = createServer(app);
dotenv.config();
const PORT = process.env.PORT;

async function main() {
  try {
    console.log("Hello world");

    // CORS config
    app.use(
      cors({
        origin: "http://localhost:5173",
        methods: ["GET, POST"],
        credentials: true,
      })
      );

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
