import express, { Request, Response } from 'express';
import psqlPool from '../utils/psqlConnection';
import dotenv from 'dotenv';
import multer from 'multer';
import { AuthenticatedRequest, verifyToken } from '../utils/authUtils';
import { insertFile } from '../utils/imageUtils';

var cors = require('cors');
dotenv.config();
const imageRouter = express.Router();
imageRouter.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

imageRouter.get("/display", async (req: Request, res: Response) => {
    const imageId = req.query.imageId;
    if (imageId === null || imageId === undefined || imageId === "") {
        return res.status(400).send("imageId parameter is required");
    }
    psqlPool.query(`SELECT i.id, i.mime_type, i.img FROM images i WHERE i.id = ${imageId} AND i.date_deleted IS NULL`).then((result: any) => {
        if (result.rows.length === 0) {
            return res.status(400).send("Image Not Found");
        } else {
            const data = result.rows[0];
            res.contentType(data.mime_type);
            return res.send(Buffer.from(data.img, 'binary'));
        }
    }).catch((error: any) => {
        console.log(error);
        res.sendStatus(500);
    });
});

imageRouter.post("/store", verifyToken, upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {

    const promise = insertFile(req);
    return promise.then((result) => {
        if (result.statusCode !== 200) {
            return res.status(result.statusCode).send(result.message);
        }
        return res.send(result.data.toString());
    })
});

export default imageRouter;