import express from "express";
import { logger } from "../logging";
import { CustomRequest } from "../types";
import { handleServerError } from "../utils/handleErrors";
import staff from "./admin/staff";
import customers from "./admin/customers";

const admin = express.Router();

admin.post(
    "/login",
    (
        req: CustomRequest<unknown, { username: string; password: string }>,
        res,
    ) => {
        const { username, password } = req.body;
        if (username === "admin" && password === "admin") {
            res.status(200).send("Logged in successfully");
        } else {
            res.status(401).send("Invalid credentials");
        }
    },
);

admin.use("/staff", staff);
admin.use("/customers", customers);

export default admin;
