import { Router } from "express";
import partController from "../../controllers/partController.js";
import fileController from "../../controllers/fileController.js";

const router = Router();

router.get("/", partController.getModels);
router.post("/add", partController.addModel);
router.post("/addRef", partController.addRef);
router.post("/addFact", partController.addFact);
router.post("/upload", fileController.uploadFile);

export default router;
