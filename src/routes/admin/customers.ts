import express from "express";
import { logger } from "../../logging";
import { CustomRequest } from "../../types";
import { handleServerError } from "../../utils/handleErrors";
import CustomerService from "../../services/CustomerService";
import { NewCustomer } from "../../db/schema/customer";

const customers = express.Router();

customers.get("/all", (req, res) => {
    CustomerService.GetAll()
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
});

customers.get("/id/:id", (req, res) => {
    const id = parseInt(req.params.id);
    CustomerService.GetById(id)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
});

customers.post(
    "/add",
    (req: CustomRequest<unknown, { customer: NewCustomer }>, res) => {
        const { customer } = req.body;
        CustomerService.Add(customer)
            .then(({ status, data }) => res.status(status).send(data))
            .catch((err) => res.send(500).send("Server error!"));
    },
);

customers.put(
    "/update",
    (
        req: CustomRequest<unknown, { customer: NewCustomer; id: number }>,
        res,
    ) => {
        const { id, customer } = req.body;
        CustomerService.Update(customer, id)
            .then(({ status, data }) => res.status(status).send(data))
            .catch((err) => res.send(500).send("Server error!"));
    },
);

customers.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    CustomerService.Delete(id)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((err) => res.send(500).send("Server error!"));
});

export default customers;
