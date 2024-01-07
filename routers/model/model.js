import { Router } from "express";
import partController from "../../controllers/partController.js";
import fileController from "../../controllers/fileController.js";

const router = Router();

router.get("/", partController.getParts);
router.get("/details/:id(\\d+)", partController.getPart);
router.put("/edit/:id(\\d+)", partController.editPart);
router.delete("/delete/:id(\\d+)", partController.deletePart);
router.post("/add", partController.addPart);

router.post("/addRef", partController.addRef);
router.put("/editRef", partController.editRef);

router.post("/addFact", partController.addFact);
router.put("/editFact", partController.editFact);

router.post("/upload", fileController.uploadFile);

export default router;
