import express from "express";
import { logger } from "../../logging";
import { CustomRequest } from "../../types";
import { handleServerError } from "../../utils/handleErrors";
import StaffService from "../../services/StaffService";
import { NewStaff } from "../../db/schema/staff";
import { prettyPrint } from "../..";

const staff = express.Router();

staff.get("/all", (req, res) => {
    StaffService.GetAll()
        .then(({ status, data }) => {
            return res.status(status).send(data);
        })
        .catch((err) => {
            return res.status(500).send({ message: "Server error!" });
        });
});

staff.get("/id/:id", (req, res) => {
    const id = parseInt(req.params.id);
    StaffService.GetById(id)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((e) => res.status(500).send({ message: "Server error!" }));
});

staff.get("/position/:position", (req, res) => {
    const { position } = req.params;
    StaffService.GetByPosition(position)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((e) => res.status(500).send({ message: "Server error!" }));
});

staff.get("/positions", (req, res) => {
    StaffService.GetPositions()
        .then(({ status, data }) => res.status(status).send(data))
        .catch((e) => res.status(500).send({ message: "Server error!" }));
});

staff.post("/add", (req: CustomRequest<unknown, { staff: NewStaff }>, res) => {
    const { staff } = req.body;
    logger.info(`Adding staff: ${prettyPrint(staff)}`);
    StaffService.Add(staff)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((e) => res.status(500).send({ message: "Server error!" }));
});

staff.put(
    "/update",
    (req: CustomRequest<unknown, { id: number; staff: NewStaff }>, res) => {
        const { id, staff } = req.body;
        logger.info(`Updating staff with id ${id}: ${prettyPrint(staff)}`);
        StaffService.Update(staff, id)
            .then(({ status, data }) => res.status(status).send(data))
            .catch((e) => res.status(500).send({ message: "Server error!" }));
    },
);

staff.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    StaffService.Delete(id)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((e) => res.status(500).send({ message: "Server error!" }));
});

export default staff;
