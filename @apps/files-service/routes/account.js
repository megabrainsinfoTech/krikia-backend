import { Router } from "express";

import { getFiles } from "../controllers/account.js";

const router = Router();

//User files
router.get("/files/:base/:path", getFiles);

//User files
// router.get("/files", getFiles());

export default router;
