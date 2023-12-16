import express from "express";
import modelRouter from "./routers/model/model.js";
import bodyParser from "body-parser";

const app = express();

app.set('view engine', 'ejs');

const PUBLIC_DIR = "public";
app.use(express.static(PUBLIC_DIR));

app.use(bodyParser.urlencoded());

app.use("/", modelRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at address http://localhost:${port}`));