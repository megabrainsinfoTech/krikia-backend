import express, {Router} from "express"
import readDir from "../controllers/read-dir.js"

const router = Router()

router.get('', readDir)



export default router