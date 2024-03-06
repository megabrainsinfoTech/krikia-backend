import * as fs from "fs"
import * as path from "path"
import { QUERIES_PATH } from "../../constants";

type SQLQuery = string;

export const loadSQL = (filePath: string): SQLQuery => {
    // Read the SQL file
    const sqlFilePath = path.join(QUERIES_PATH, filePath); // Replace with your actual file path
   return fs.readFileSync(`${sqlFilePath}.sql`, 'utf8');
}