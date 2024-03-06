import fs from "fs"
import path from "path"
import { config } from "dotenv"

config() //dotenv config

const createDirectory = (req, res, next)=> {
    
    const date = new Date()
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const day = date.getUTCDate()

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    
     //Make new directory for every new user
     fs.mkdir(path.join(path.resolve("../"), `${process.env.DIRS_ROOT}/${year}/${req.params.id}`), { recursive: true }, (err)=> {
        if(err) res.send("Error => "+ err)
        else res.send("Folder created successfully")
    })
}

export default createDirectory