import { allowedNodeEnvironmentFlags } from "process";
import { prettyPrint } from "..";
import { logger } from "../logging";
import { ServiceReturn } from "../types";
import { OK } from "../utils";
import { handleServerError } from "../utils/handleErrors";
import {
    NewCustomer,
    deleteCustomerById,
    getAllCustomers,
    getCustomerByFirstAndLastName,
    getCustomerById,
    insertCustomer,
    updateCustomerById,
} from "../db/schema/customer";
import { updateStaffById } from "../db/schema/staff";

class CustomerService {
    async GetAll(): Promise<ServiceReturn> {
        try {
            const customers = await getAllCustomers();
            return OK({ customers });
        } catch (err) {
            return handleServerError(err, "Error getting all customers");
        }
    }

    async GetById(id: number): Promise<ServiceReturn> {
        try {
            const customer = await getCustomerById(id);
            return OK({ customer });
        } catch (err) {
            return handleServerError(err, "Error getting customer by id");
        }
    }

    async Delete(id: number): Promise<ServiceReturn> {
        try {
            const customer = await getCustomerById(id);
            if (customer.length === 0) {
                return {
                    status: 404,
                    data: { message: "Customer not found" },
                };
            }

            const res = await deleteCustomerById(id);
            logger.info(`Customer deleted successfully: ${prettyPrint(res)}`);
            return OK({ message: "Customer deleted successfully" });
        } catch (err) {
            return handleServerError(err, "Error deleting customer");
        }
    }

    async GetByFirstAndLastName(
        first: string,
        last: string,
    ): Promise<ServiceReturn> {
        try {
            const customer = await getCustomerByFirstAndLastName(first, last);
            return OK({ customer });
        } catch (err) {
            return handleServerError(
                err,
                "Error getting customer by first and last name",
            );
        }
    }

    async Add(customer: NewCustomer): Promise<ServiceReturn> {
        try {
            const currCus = await getCustomerByFirstAndLastName(
                customer.firstName,
                customer.lastName,
            );
            if (currCus.length > 0) {
                return {
                    status: 409,
                    data: { message: "Customer already exists" },
                };
            }
            const res = await insertCustomer(customer);
            const id = res[0].insertId;
            return OK({ id });
        } catch (err) {
            return handleServerError(err, "Error adding customer");
        }
    }

    async Update(customer: NewCustomer, id: number): Promise<ServiceReturn> {
        try {
            const res = await updateCustomerById(id, customer);
            return OK({ message: `Customer ${id} updated successfully` });
        } catch (err) {
            return handleServerError(err, "Error updating customer");
        }
    }
}

export default new CustomerService();
