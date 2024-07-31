import Express from "express";
import OrderService from "../../services/OrderService";

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

order.post("/add", (req, res) => {});

order.put("/update", (req, res) => {});

order.delete("/delete/:id", (req, res) => {});

export default order;
