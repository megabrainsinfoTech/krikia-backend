
import * as path from 'path';

export const ROOT_PATH = path.resolve(__dirname);
export const QUERIES_ROOT = path.join(path.resolve("../"));
export const CONTROLLERS_PATH = path.join(ROOT_PATH, 'src', '+controllers');
export const QUERIES_PATH = path.join(QUERIES_ROOT, '+queries');
export const ROUTES_PATH = path.join(ROOT_PATH, 'src', '+routes');