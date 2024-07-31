import Express from "express";
import RestockService from "../../services/RestockService";
import { CustomRequest } from "../../types";

const restock = Express.Router();

restock.get("/inventory-all", (req, res) => {
    RestockService.GetAllInventory()
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
});

restock.get("/supplier-all", (req, res) => {
    RestockService.GetAllSuppliers()
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
});

restock.get("/most-ordered", (req, res) => {
    RestockService.GetMostOrdered()
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
});

restock.post(
    "/reduce-stock",
    (req: CustomRequest<unknown, { id: number; quantity: number }>, res) => {
        const { id, quantity } = req.body;
        RestockService.ReduceStock(id, quantity)
            .then(({ status, data }) => res.status(status).send(data))
            .catch((err) => res.send(500).send("Server error!"));
    },
);

restock.post(
    "/increase-stock",
    (req: CustomRequest<unknown, { id: number; quantity: number }>, res) => {
        const { id, quantity } = req.body;
        RestockService.IncreaseStock(id, quantity)
            .then(({ status, data }) => res.status(status).send(data))
            .catch((err) => res.send(500).send("Server error!"));
    },
);

restock.get("/to-be-restocked", (req, res) => {
    RestockService.GetInventoryToBeRestockedWithSuppliers()
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
});

export default restock;

