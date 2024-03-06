import fs from "fs"
import path from "path"

import { config } from "dotenv"

config() //dotenv config


const readDir = (req, res, next)=> {
    fs.readdir(path.join(path.resolve("../"), `${process.env.DIRS_ROOT}/${req.body.year}/${req.params.id}`), (err, files) => {
        if(err) res.status().send("")
        res.status(200).json({files}) //else
    })
}   

export default readDir