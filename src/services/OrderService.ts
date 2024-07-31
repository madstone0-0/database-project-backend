import {
    NewOrder,
    getAllOrderWithDetails,
    getCustomerOrders,
    insertOrder,
} from "../db/schema/order";
import { ServiceReturn } from "../types";
import { OK } from "../utils";
import { handleServerError } from "../utils/handleErrors";

class OrderService {
    async GetAllOrders(): Promise<ServiceReturn> {
        try {
            const allOrderWithDeets = await getAllOrderWithDetails();
            return OK({ allOrders: allOrderWithDeets });
        } catch (err) {
            return handleServerError(err, "Error fetching all orders");
        }
    }

    async GetCustomerOrders(customerId: number): Promise<ServiceReturn> {
        try {
            const customerOrders = await getCustomerOrders(customerId);
            return OK({ customerOrders });
        } catch (err) {
            return handleServerError(err, "Error fetching customer orders");
        }
    }

    async AddOrder(
        order: NewOrder,
        menuItemId: number,
        quantity: number,
    ): Promise<ServiceReturn> {
        try {
            const res = await insertOrder(order, menuItemId, quantity);
            return OK({ message: "Order added successfully" });
        } catch (err) {
            return handleServerError(err, "Error adding order");
        }
    }

}

export default new OrderService();
