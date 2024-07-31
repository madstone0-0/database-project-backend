import express from "express";
import { NewCarpark } from "../../db/schema/carpark";
import { logger } from "../../logging";
import CarparkService from "../../services/CarparkService";
import { CustomRequest } from "../../types";
import { handleServerError } from "../../utils/handleErrors";

const carpark = express.Router();

carpark.get("/all", (req, res) => {
    CarparkService.GetAll()
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
});

carpark.get("/id/:id", (req, res) => {
    const id = parseInt(req.params.id);
    CarparkService.GetById(id)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
})

carpark.post("/add", (req: CustomRequest<unknown, { parkingSpot: NewCarpark }>, res) => {
    const { parkingSpot } = req.body;
    CarparkService.Add(parkingSpot)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
})

carpark.put("/update", (req: CustomRequest<unknown, { parkingSpot: NewCarpark, id: number }>, res) => {
    const { id, parkingSpot } = req.body;
    CarparkService.Update(parkingSpot, id)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
})

carpark.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    CarparkService.Delete(id)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
})

export default carpark;