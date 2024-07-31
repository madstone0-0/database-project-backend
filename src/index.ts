import express, { NextFunction, Request, Response } from "express";
import { httpLogger, logger } from "./logging";
import { HOST, PORT } from "./constants";
import helmet from "helmet";
import cors from "cors";
import admin from "./routes/admin";
import user from "./routes/user";

const app = express();
app.use(httpLogger);
app.use(express.json());
app.use(helmet());
// app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cors());

export const prettyPrint = <T>(log: T) => {
    return JSON.stringify(log, undefined, 4);
};

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: "Server error!" });
});

app.get("/health", (_req, res) => {
    res.status(200).send("Up");
});

app.use("/admin", admin);

app.use("/user", user);

app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
});
