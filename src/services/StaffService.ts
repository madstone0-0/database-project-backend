import { prettyPrint } from "..";
import {
    NewStaff,
    deleteStaffById,
    getAllStaff,
    getOrdersByWaiter,
    getStaffByFirstAndLastName,
    getStaffById,
    getStaffByPosition,
    getStaffPositions,
    getWaitersAndChefs,
    insertStaff,
    updateStaffById,
} from "../db/schema/staff";
import { logger } from "../logging";
import { ServiceReturn } from "../types";
import { OK } from "../utils";
import { handleServerError } from "../utils/handleErrors";

class StaffService {
    async GetAll(): Promise<ServiceReturn> {
        try {
            const staff = await getAllStaff();
            return {
                status: 200,
                data: { staff },
            };
        } catch (err) {
            return handleServerError(err, "Error getting all staff");
        }
    }

    async GetById(id: number): Promise<ServiceReturn> {
        try {
            const staff = await getStaffById(id);
            return {
                status: 200,
                data: { staff },
            };
        } catch (err) {
            return handleServerError(err, "Error getting staff by id");
        }
    }

    async GetByPosition(position: string): Promise<ServiceReturn> {
        try {
            const staff = await getStaffByPosition(position);
            return OK({ staff });
        } catch (err) {
            return handleServerError(err, "Error getting staff by position");
        }
    }

    async Delete(id: number): Promise<ServiceReturn> {
        try {
            const staff = await getStaffById(id);
            if (staff.length === 0) {
                return {
                    status: 404,
                    data: { message: "Staff not found" },
                };
            }

            const res = await deleteStaffById(id);
            logger.info(`Staff deleted successfully: ${prettyPrint(res)}`);
            return {
                status: 200,
                data: { message: "Staff deleted successfully" },
            };
        } catch (err) {
            return handleServerError(err, "Error deleting staff");
        }
    }

    async GetByFirstAndLastName(
        first: string,
        last: string,
    ): Promise<ServiceReturn> {
        try {
            const staff = await getStaffByFirstAndLastName(first, last);
            return OK({ staff });
        } catch (err) {
            return handleServerError(
                err,
                "Error getting staff by first and last name",
            );
        }
    }

    async Add(staff: NewStaff): Promise<ServiceReturn> {
        try {
            const currStaff = await getStaffByFirstAndLastName(
                staff.firstName,
                staff.lastName,
            );

            if (currStaff.length > 0) {
                return {
                    status: 400,
                    data: { message: "Staff already exists" },
                };
            }

            const res = await insertStaff(staff);
            const id = res[0].insertId;
            return OK({ id });
        } catch (err) {
            return handleServerError(err, "Error adding staff");
        }
    }

    async Update(staff: NewStaff, id: number): Promise<ServiceReturn> {
        try {
            const res = await updateStaffById(id, staff);
            return OK({ message: `Staff ${id} updated successfully` });
        } catch (err) {
            return handleServerError(err, "Error updating staff");
        }
    }

    async GetOrdersByWaiter(): Promise<ServiceReturn> {
        try {
            const orders = await getOrdersByWaiter();
            return OK({ orders });
        } catch (err) {
            return handleServerError(err, "Error getting orders by waiter");
        }
    }

    async GetWaitersAndChefs(): Promise<ServiceReturn> {
        try {
            const staff = await getWaitersAndChefs();
            return OK({ staff });
        } catch (err) {
            return handleServerError(err, "Error getting waiters and chefs");
        }
    }

    async GetPositions(): Promise<ServiceReturn> {
        try {
            const positionsObj = await getStaffPositions();
            let positions = positionsObj.map((p) => p.position);

            return OK({ positions });
        } catch (err) {
            return handleServerError(err, "Error getting staff positions");
        }
    }
}

export default new StaffService();
