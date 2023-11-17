import express from "express";
import modelRouter from "./routers/model/model.js";
import bodyParser from "body-parser";

const app = express();

const PUBLIC_DIR = "public";
app.use(express.static(PUBLIC_DIR));

app.use(bodyParser.urlencoded());

app.use("/part", modelRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));