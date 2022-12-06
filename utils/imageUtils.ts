import { AuthenticatedRequest } from "./authUtils";
import { InternalServiceResult } from "./generalUtils";
import psqlPool from "./psqlConnection";

export const insertFile: (req: AuthenticatedRequest) => Promise<InternalServiceResult> = async (req: AuthenticatedRequest) => {
    const file = req.file;
    if (file === undefined) {
        return { statusCode: 400, message: "No File Found" };
    } else {
        const { originalname, mimetype, size, buffer } = file;
        if (size > 2000000) { // Current File size limit is about 2 mb
            return { statusCode: 400, message: "File is too large" };
        }
        
        return await psqlPool.query('INSERT INTO images (user_id, file_name, mime_type, img) VALUES ($1, $2, $3, $4) RETURNING id',
            [req.userId, originalname, mimetype, buffer]
        ).then((result: { rows: { id: any; }[]; }) => {
            return { statusCode: 200, message: "OK", data: result.rows[0].id };
        }).catch((error: any) => {
            console.log(error);
            return { statusCode: 500, message: "Insert Failed" };
        });
    }
};