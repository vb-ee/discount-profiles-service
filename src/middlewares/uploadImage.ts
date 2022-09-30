import multer from 'multer'
import { Request } from 'express'
import path from 'path'

export const uploadImage = multer({
    dest: path.join(`${process.env.PWD}/`, 'images'),
    fileFilter(req: Request, file, callback) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/))
            callback(new Error('Not acceptable file type'))
        callback(null, true)
    }
})
