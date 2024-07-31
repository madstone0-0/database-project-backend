import Express from "express";
import order from "./user/order";

const user = Express.Router();

user.use("/order", order);

export default user;
