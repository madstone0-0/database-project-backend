import { InferInsertModel, InferSelectModel, eq, sql } from "drizzle-orm";
import {
    boolean,
    date,
    double,
    int,
    mysqlEnum,
    mysqlTable,
    serial,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import db from "../../db";

export const carpark = mysqlTable("carpark", {
    positionId: int("position_id").primaryKey(),
    occupied: boolean("occupied"),
    specialNeeds: boolean("special_needs"),
    vip: boolean("vip"),
});

export type Carpark = InferSelectModel<typeof carpark>;
export type NewCarpark = InferInsertModel<typeof carpark>;

const allParkingSpots = db.select().from(carpark).orderBy(carpark.positionId);

const parkingSpotById = db.select().from(carpark).where(eq(carpark.positionId, sql.placeholder("id")));

const parkingSpotRemoveById = db.delete(carpark).where(
    eq(
        carpark.positionId,
        sql.placeholder("id")
    )
)

export const getAllParkingSpots = async () => allParkingSpots.execute()

export const getParkingSpotById = async(id: number) => parkingSpotById.execute({id})

export const insertParkingSpot = async(newParkingSpot: NewCarpark) => db.insert(carpark).values(newParkingSpot)

export const deleteParkingSpotById = async(id: number) => parkingSpotRemoveById.execute({id})

export const updateParkingSpotById = async(id: number, newParkingSpot: NewCarpark) => db.update(carpark).set(newParkingSpot).where(eq(
    carpark.positionId,
    id
))
