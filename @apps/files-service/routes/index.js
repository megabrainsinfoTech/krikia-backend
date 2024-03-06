import express, { Router } from "express";

import createDirRoute from "./create.js"
import filePathRoute from "./file.js"
import locationRoute from "./location.js";
import accountRoute from "./account.js";

const router = Router();

router.use(createDirRoute);
router.use(filePathRoute);
router.use("/location", locationRoute);
router.use("/account", accountRoute);

export default router;
