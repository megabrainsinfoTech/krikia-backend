import express, {Router} from "express"
import path from "path"
import multer from "multer"

import { config } from "dotenv"

import readFile from "../controllers/file/read-file.js"
import postFile from "../controllers/file/post-file.js"

config() //dotenv config

// const fileUrl = url.parse()
const multerConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(path.resolve('../'), `${process.env.DIRS_ROOT}/${req.params.year}/${req.params.id}/`))
    },

    filename: (req, file, cb)=> {
        console.log("File")
        console.log(file);
        const ext = file.mimetype.split('/')[1]
        cb(null, `${file.originalname === file.fieldname ? `${file.fieldname}.${ext}` : `upload_${Date.now()}.${ext}`}`)
    }
})

const upload = multer({storage: multerConfig})

const router = Router();

// Get file
router.use(readFile);

//Post file
router.post('/:year/:id', upload.single("image"), postFile)

export default router