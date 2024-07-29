import dotenv from "dotenv";
dotenv.config();

export const HOST = "0.0.0.0";
export const PORT = 3000;

let MY_USER: string;
let MY_PASS: string;
let MY_HOST: string;
let MY_DB: string;
let MY_PORT: number;

switch (process.env.NODE_ENV) {
    case "dev":
        MY_USER = "madiba";
        MY_PASS = "madiba";
        MY_HOST = "0.0.0.0";
        MY_DB = "restaurant";
        MY_PORT = 3306;
        break;
    case "prod":
        MY_USER = process.env.MY_USER!;
        MY_PASS = process.env.MY_PASSWORD!;
        MY_HOST = process.env.MY_HOST!;
        MY_DB = process.env.MY_DATABASE!;
        MY_PORT = parseInt(process.env.MY_PORT!);
        break;
}

export { MY_DB, MY_PASS, MY_USER, MY_HOST, MY_PORT };
