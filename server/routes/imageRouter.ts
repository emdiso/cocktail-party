import express, { Request, Response } from 'express';
import psqlPool from '../utils/psqlConnection';
import dotenv from 'dotenv';
import multer from 'multer';
import { AuthenticatedRequest, verifyToken } from '../utils/authUtils';

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
    psqlPool.query(`SELECT i.id, i.mime_type, i.img FROM images i WHERE i.id = ${imageId}`).then((result: any) => {
        if (result.rows.length === 0) {
            return res.status(400).send("imageId not found");
        } else {
            const data = result.rows[0];
            res.contentType(data.mime_type);
            return res.send(Buffer.from(data.img, 'binary'));
        }
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

imageRouter.post("/store", verifyToken, upload.single("image"), (req: AuthenticatedRequest, res: any) => {
    const file = req.file;
    if (file === undefined) {
        return res.status(400).send("no image found");
    } else {
        const { originalname, mimetype, size, buffer } = file;
        console.log(size);
        if (size > 2000000) { // Current File size limit is about 2 mb
            return res.status(400).send("File is too large");
        }
        
        psqlPool.query('INSERT INTO images (user_id, file_name, mime_type, img) VALUES ($1, $2, $3, $4, $5)',
            [req.userId, originalname, mimetype,  buffer]
        ).then(() => {
            return res.send();
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(500);
        });
    }
});

export default imageRouter;