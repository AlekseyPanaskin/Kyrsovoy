import { Router } from "express";
import { fileURLToPath } from "url";
import path from "path";
import partController from "../../controllers/partController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });

router.get("/add", (req, res) => {
    res.sendFile(path.join(__dirname, "form.html"));
  });

router.post("/add", partController.addModel);

export default router;
