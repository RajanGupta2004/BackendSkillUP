import express, { Request, Response, NextFunction } from "express";

const app = express();

// middleware

app.use(express.json());

// middleware to add the start tine on requesst

interface CustomRequest extends Request {
  startTime?: number;
}

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
});

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Service is running",
  });
});

export default app;
