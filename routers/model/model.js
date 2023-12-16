import { Router } from "express";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import partController from "../../controllers/partController.js";
import fileController from "../../controllers/fileController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

router.get("/table", (req, res) => {
  let filesDir = path.join(path.dirname(process.argv[1]), 'public/storage/');
  let fileNames = fs.readdirSync(filesDir, {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name)

  res.render('table', {
    filenames: fileNames
  })
});

router.get("/add", (req, res) => {
    res.sendFile(path.join(__dirname, "form.html"));
});

router.post("/add", partController.addModel);
router.post("/upload", fileController.uploadFile);

export default router;
