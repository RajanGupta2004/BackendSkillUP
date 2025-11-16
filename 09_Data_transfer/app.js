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

  streamData.on("data", (chunk) => {
    console.log("sending data", chunk.toString());
  });

  streamData.pipe(res);
});

app.listen(PORT, () => {
  console.log("server is runnig on the port ");
});
