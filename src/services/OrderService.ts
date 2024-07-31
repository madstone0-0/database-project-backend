import { getAllMenuItems } from "../db/schema/menuItem";
import { NewMenuItemInventory } from "../db/schema/menuItemInventory";
import {
    NewOrder,
    deleteOrder,
    getAllOrderWithDetails,
    getCustomerOrders,
    insertOrder,
    updateOrder,
} from "../db/schema/order";
import {
    NewOrderDetails,
    deleteOrderDetails,
    getOrderDetailsByOrderId,
    insertOrderDetails,
    updateOrderDetails,
} from "../db/schema/orderDetails";
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

    async GetAllMenuItems(): Promise<ServiceReturn> {
        try {
            const menuItems = await getAllMenuItems();
            return OK({ menuItems });
        } catch (err) {
            return handleServerError(err, "Error fetching all menu items");
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

    async Add(
        order: NewOrder,
        menuItemId: number,
        quantity: number,
    ): Promise<ServiceReturn> {
        try {
            const ord = await insertOrder(order);
            const orderDetails: NewOrderDetails = {
                orderId: ord[0].insertId,
                menuItemId,
                quantity,
            };
            const res = await insertOrderDetails(orderDetails);
            return OK({ message: "Order added successfully" });
        } catch (err) {
            return handleServerError(err, "Error adding order");
        }
    }

    async Update(
        orderId: number,
        order: NewOrder,
        menuItemId: number,
        quantity: number,
    ): Promise<ServiceReturn> {
        try {
            const ord = await updateOrder(orderId, order);
            const orderDetails: NewOrderDetails = {
                orderId,
                menuItemId,
                quantity,
            };
            const res = await updateOrderDetails(orderId, orderDetails);
            return OK({ message: "Order updated successfully" });
        } catch (err) {
            return handleServerError(err, "Error updating order");
        }
    }

    async Delete(orderId: number): Promise<ServiceReturn> {
        try {
            const res = await deleteOrder(orderId);
            const res2 = await deleteOrderDetails(orderId);
            return OK({ message: "Order deleted successfully" });
        } catch (err) {
            return handleServerError(err, "Error deleting order");
        }
    }
}

export default new OrderService();
