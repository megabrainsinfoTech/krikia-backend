import path from "path"
import fs from "fs"

export const getFiles = async (req, res, next)=> {
   fs.readdir(path.join(path.resolve("../"), `${process.env.DIRS_ROOT}/${req.params.base}/${req.params.path}`), {}, (err, files) => {
        if(err){
            res.status(400).json(err);
            next(err);
        }
       
        const mappedFiles = files.map(file => `${process.env.BASE_PATH}/${req.params.base}/${req.params.path}/${file}`);
        const filesObj = mappedFiles.reduce((acc, curr) => {
            if(curr.endsWith("jpg") || curr.endsWith("jpeg") || curr.endsWith("png")){
                if(!!acc["images"]) acc["images"].push(curr);
                else acc["images"] = [curr];
            } else if(curr.endsWith("mp4") || curr.endsWith("mpeg") || curr.endsWith("mov")){
                if(!!acc["videos"]) acc["videos"].push(curr);
                else acc["videos"] = [curr];
            } else {
                if(!!acc["documents"]) acc["documents"].push(curr);
                else acc["documents"] = [curr];
            }

            return acc;
        }, {})
        res.json(filesObj);
    })
}
