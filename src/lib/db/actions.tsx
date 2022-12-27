import { Board, BoardPins } from '@utils/custom-types';
import { database, Server } from './config';
import { ID } from "appwrite";

const createBoardDocument = async (data: Board) => {
    try {
        return database.createDocument(
            Server.DATABASE_ID,
            Server.BOARD_COLLECTION_ID,
            ID.unique(),
            data,
        );
    } catch (e: any) {
        console.error(e.message);
    }
};

const getBoardsDocument = async () => {
    try {
        return database.listDocuments(Server.DATABASE_ID, Server.BOARD_COLLECTION_ID);
    } catch (e: any) {
        console.error(e.message);
    }
};

const updateBoardDocument = async (data: Board, documentID: string) => {
    try {
        return database.updateDocument(
            Server.DATABASE_ID,
            Server.BOARD_COLLECTION_ID,
            documentID,
            data,
        );
    } catch (e: any) {
        console.error(e.message);
    }
};

const deleteBoardDocument = async (documentID: string) => {
    try {
        return database.deleteDocument(Server.DATABASE_ID, Server.BOARD_COLLECTION_ID, documentID);
    } catch (e: any) {
        console.error(e.message);
    }
};

export {
    createBoardDocument,
    getBoardsDocument,
    updateBoardDocument,
    deleteBoardDocument
};