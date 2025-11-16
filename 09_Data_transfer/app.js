import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
app.use(cors("*"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("_dirname", __dirname);
console.log("__filename", __filename);

const PORT = 9000;

app.get("/text", (req, res) => {
  const filePath = path.join(__dirname, "data.txt");
  res.setHeader("Content-Type", "text/plain");
  console.log("filePath", filePath);

  const streamData = fs.createReadStream(filePath, {
    highWaterMark: 64,
  });

  // streamData.on("data", (chunk) => {
  //   console.log("sending data", chunk.toString());
  // });

  streamData.pipe(res);
});

app.get("/music", (req, res) => {
  const songPath = path.join(__dirname, "song.mp3");
  const stat = fs.statSync(songPath);

  const range = req.headers.range;
  if (!range) {
    return res.status(400).send("Requires Range header");
  }

  const CHUNK_SIZE = 1 * 1e6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, stat.size - 1);

  const contentLength = end - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mpeg",
  });

  fs.createReadStream(songPath, { start, end }).pipe(res);
});

app.listen(PORT, () => {
  console.log("server is runnig on the port ");
});
