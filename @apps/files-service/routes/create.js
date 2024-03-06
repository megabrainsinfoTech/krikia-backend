import express, {Router} from "express"
import createDirectory from "../controllers/create-directory.js"

const router = Router()

router.post('/create/:id', createDirectory)

export default router