import {
    getAllInventory,
    getAllToBeRestocked,
    getInventoryById,
    updateInventoryById,
} from "../db/schema/inventory";
import { getMostOrderedItems } from "../db/schema/menuItem";
import { getAllSuppliers } from "../db/schema/supplier";
import { ServiceReturn } from "../types";
import { OK } from "../utils";
import { handleServerError } from "../utils/handleErrors";

class RestockService {
    async GetAllInventory(): Promise<ServiceReturn> {
        try {
            const inventory = await getAllInventory();
            return OK({ inventory });
        } catch (err) {
            return handleServerError(err, "Error getting all inventory");
        }
    }

    async GetAllSuppliers(): Promise<ServiceReturn> {
        try {
            const suppliers = await getAllSuppliers();
            return OK({ suppliers });
        } catch (err) {
            return handleServerError(err, "Error getting all suppliers");
        }
    }

    async GetMostOrdered(): Promise<ServiceReturn> {
        try {
            const mostOrdered = await getMostOrderedItems();
            return OK({ mostOrdered });
        } catch (err) {
            return handleServerError(err, "Error getting most ordered items");
        }
    }

    async ReduceStock(id: number, quantity: number): Promise<ServiceReturn> {
        try {
            const inventory = (await getInventoryById(id))[0];

            if (inventory.quantity < quantity) {
                return {
                    status: 400,
                    data: { message: "Not enough stock to reduce" },
                };
            }

            const newInventory = {
                ...inventory,
                quantity: inventory.quantity - quantity,
            };

            const res = updateInventoryById(id, newInventory);
            return OK({ message: "Stock reduced successfully" });
        } catch (err) {
            return handleServerError(err, "Error reducing stock");
        }
    }

    async IncreaseStock(id: number, quantity: number): Promise<ServiceReturn> {
        try {
            const inventory = (await getInventoryById(id))[0];
            const newInventory = {
                ...inventory,
                quantity: inventory.quantity + quantity,
            };

            const res = updateInventoryById(id, newInventory);
            return OK({ message: "Stock increased successfully" });
        } catch (err) {
            return handleServerError(err, "Error increasing stock");
        }
    }

    async GetInventoryToBeRestockedWithSuppliers(): Promise<ServiceReturn> {
        try {
            const inventoryWithSupplier = await getAllToBeRestocked();
            return OK({ inventoryWithSupplier });
        } catch (err) {
            return handleServerError(
                err,
                "Error getting inventory to be restocked with suppliers",
            );
        }
    }
}

export default new RestockService();

