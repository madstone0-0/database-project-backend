import { prettyPrint } from "..";
import { NewCarpark, deleteParkingSpotById, getAllParkingSpots, getParkingSpotById, insertParkingSpot, updateParkingSpotById } from "../db/schema/carpark";
import { logger } from "../logging";
import { ServiceReturn } from "../types";
import { OK } from "../utils";
import { handleServerError } from "../utils/handleErrors";

class CarparkService {
    async GetAll(): Promise<ServiceReturn> {
        try {
            const parkingSpots = await getAllParkingSpots();
            return OK({ parkingSpots });
        } catch (err) {
            return handleServerError(err, "Error getting all parking spots");
        }
    }

    async GetById(id: number): Promise<ServiceReturn> {
        try {
            const parkingSpot = await getParkingSpotById(id);
            return OK({parkingSpot})
        } catch(err) {
            return handleServerError(err, "Error getting parking spot by id");
        }
    }
    
    async Delete(id: number): Promise<ServiceReturn> {
        try {
            const parkingSpot = await getParkingSpotById(id);
            if (parkingSpot.length === 0) {
                return {
                    status: 404,
                    data: { message: "Parking spot not found" },
                };
            }

            const res = await deleteParkingSpotById(id);
            logger.info(`Parking spot deleted successfully: ${prettyPrint(res)}`);
            return OK({ message: "Parking spot deleted successfully" });

        }catch (err) {
            return handleServerError(err, "Error deleting parking spot");
        }
    }
    
    async Add(pakringSpot: NewCarpark): Promise<ServiceReturn> {
        try {
            const res = await insertParkingSpot(pakringSpot)
            const id = res[0].insertId;
            return OK({id})
        } catch(err) {
            return handleServerError(err, "Error adding parking spot");
        }
    }
    
    async Update(parkingSpot: NewCarpark, id: number): Promise<ServiceReturn> {
        try {
            const res = await updateParkingSpotById(id, parkingSpot);
            return OK({message: `Parking spot ${id} updated successfully`});
        } catch(err) {
            return handleServerError(err, "Error updating parking spot");
        }
    }
}

export default new CarparkService();