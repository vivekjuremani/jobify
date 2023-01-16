import express from "express";
const app = express();
import dotenv from "dotenv";
import "express-async-errors"; // replace try-catch in error handler
dotenv.config();
import errorHandler from "./middleware/error-handler.js";
import notFound from "./middleware/not-found.js";
import connectDB from "./db/connect.js";
import { authRouter, jobsRouter } from "./routes/index.js";
import morgan from "morgan";
import authenticateUser from "./middleware/auth.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "./client/build")));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.use(notFound);
app.use(errorHandler);

app.get("*", (req, res) => {
  res.send(express.static(path.join(__dirname, "./client/build/index.html")));
});
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log("database not connected");
  }
};
start();
