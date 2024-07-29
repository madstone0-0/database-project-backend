import { ServiceReturn } from "../types";

export const convertToUnix = (time: string) =>
    new Date(new Date().toISOString().split("T")[0] + "T" + time).getTime();

export const convertToHuman = (time: number) =>
    new Date(time).toLocaleString().split(",")[1];

export const OK = <T>(thing: T): ServiceReturn<T> => {
    return {
        status: 200,
        data: thing,
    };
};
