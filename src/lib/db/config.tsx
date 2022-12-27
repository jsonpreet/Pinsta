import { Client as Appwrite, Databases } from "appwrite";

export const Server = {
    ENDPOINT: process.env.NEXT_PUBLIC_DB_ENDPOINT as string,
    PROJECT: process.env.NEXT_PUBLIC_DB_PROJECT as string,
    BOARD_COLLECTION_ID: process.env.NEXT_PUBLIC_BOARD_COLLECTION_ID as string,
    PIN_COLLECTION_ID: process.env.NEXT_PUBLIC_PIN_COLLECTION_ID as string,
    DATABASE_ID: process.env.NEXT_PUBLIC_DB_ID as string,
};

export const client = new Appwrite()
    .setEndpoint(Server.ENDPOINT)
    .setProject(Server.PROJECT);

export const database = new Databases(client);
