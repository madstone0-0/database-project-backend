import Express from "express";
import OrderService from "../../services/OrderService";
import { CustomRequest } from "../../types";
import { NewOrder } from "../../db/schema/order";

const order = Express.Router();

// order.get("/all", (req, res) => {
// });

order.get("/id/:id", (req, res) => {});

order.get("/customer/:id", (req, res) => {
    const customerId = parseInt(req.params.id);
    OrderService.GetCustomerOrders(customerId)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((e) => res.status(500).send({ message: "Server error!" }));
});

order.post(
    "/add",
    (
        req: CustomRequest<
            unknown,
            { order: NewOrder; menuItemId: number; quantity: number }
        >,
        res,
    ) => {
        const { order, menuItemId, quantity } = req.body;
        OrderService.Add(order, menuItemId, quantity)
            .then(({ status, data }) => res.status(status).send(data))
            .catch((e) => res.status(500).send({ message: "Server error!" }));
    },
);

order.get("/menu-items-all", (req, res) => {
    OrderService.GetAllMenuItems()
        .then(({ status, data }) => res.status(status).send(data))
        .catch((e) => res.status(500).send({ message: "Server error!" }));
});

order.put(
    "/update",
    (
        req: CustomRequest<
            unknown,
            {
                orderId: number;
                order: NewOrder;
                menuItemId: number;
                quantity: number;
            }
        >,
        res,
    ) => {
        const { orderId, order, menuItemId, quantity } = req.body;
        OrderService.Update(orderId, order, menuItemId, quantity)
            .then(({ status, data }) => res.status(status).send(data))
            .catch((e) => res.status(500).send({ message: "Server error!" }));
    },
);

order.delete("/delete/:id", (req, res) => {
    const orderId = parseInt(req.params.id);
    OrderService.Delete(orderId)
        .then(({ status, data }) => res.status(status).send(data))
        .catch((e) => res.status(500).send({ message: "Server error!" }));
});

export default order;
