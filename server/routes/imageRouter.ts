import express, { Request, Response } from 'express';
// import fileUpload, { UploadedFile } from 'express-fileupload';
import psqlPool from '../utils/psqlConnection';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { AuthenticatedRequest, verifyToken } from '../utils/authUtils';
import path from 'path';


dotenv.config();
const imageRouter = express.Router();
// imageRouter.use(fileUpload());
imageRouter.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

imageRouter.get("/get", async (req: Request, res: Response) => {
    const imageId = req.query.imageId;
    if (imageId === null || imageId === undefined || imageId === "") {
        return res.status(400).send("imageId parameter is required");
    }
    psqlPool.query(`SELECT i.id FROM images i WHERE i.id = ${imageId}`).then((result: any) => {
        if (result.rows.length === 0) {
            return res.status(400).send("imageId not found");
        } else {
            return res.send(); // return actual image after converting
        }
    });
});

// imageRouter.post("/store", verifyToken, (req: AuthenticatedRequest, res: Response) => {
//     const file = req.files?.file;
//     if (file === undefined) {
//         return res.status(400).send("no image found");
//     } else if (Array.isArray(file)) {
//         return res.sendStatus(500);
//     }
//     const { name, data } = file;
//     const extension = path.extname(name);

//     const allowedExtensions = ["png","jpg","jpeg","gif"];
//     if (allowedExtensions.includes(extension)) {
//         return res.status(400).send("invalid file type");
//     } else if (data.length > 50000) {
//         return res.status(400).send("file is too large");
//     }

//     return res.send("You made it pretty far");


// });

imageRouter.post("/store", verifyToken, upload.single("image"), (req: any, res: any) => {
    const file = req.file;
    if (file === undefined) {
        return res.status(400).send("no image found");
    } else {
        console.log(file);
        const { originalname, mimetype, encoding, size, buffer } = file;
        console.log(Buffer.isBuffer(buffer))
        
        psqlPool.query('INSERT INTO images (user_id, file_name, mime_type, encoding_format, img) VALUES ($1, $2, $3, $4, $5)',
            [req.userId, originalname, mimetype, encoding, buffer]
        ).then(() => {
            return res.send();
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(500);
        });
    }
});

export default imageRouter;