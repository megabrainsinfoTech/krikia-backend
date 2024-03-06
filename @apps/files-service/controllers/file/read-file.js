import express, { Router } from "express"
import path from "path"
import { config } from "dotenv"

config()

const router = Router()

router.use((req, res, next)=> {
    router.use(express.static(path.join(path.resolve('../'), process.env.DIRS_ROOT)))
    next()
})

export default router