import express from "express";
import { createServer } from "node:http";

const app = express();

const server = createServer(app);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "server is running ",
  });
});

export default server;
