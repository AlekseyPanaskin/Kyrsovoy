import path from "path";
import fs from "fs";
import partService from '../services/partService.js';
import { IndexViewModel } from "../viewModels/indexViewModel.js";

const getModel = async (req, res, next) => {
    try {
        const data = await partService.getModels();
        res.send(data);
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}

const getModels = async (req, res, next) => {
    try {
        const parts = await partService.getModels();
        
        if (!parts) {
            res.sendStatus(500);
        }

        let filesDir = path.join(path.dirname(process.argv[1]), 'public/storage/');
        let fileNames = fs.readdirSync(filesDir, {withFileTypes: true})
            .filter(item => !item.isDirectory())
            .map(item => item.name);

        let vms = [];

        for (const part of parts) {
            let vm = new IndexViewModel(
                    part['prod_name'],
                    part['prod_releaser'],
                    new Date(part['report_date']).toLocaleDateString('ru-RU'),
                    part['consignment'],
                    part['selection'],
                    fileNames.find(f => f == part['prod_file'])
                );

            vms.push(vm);
        }

        res.render('index', {
            vms
        });
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}


function emptyToNull(obj) {
    Object.keys(obj).forEach(key => { 
        if (!obj[key] || obj[key] == '') {
            obj[key] = null
        }
    });
}

const addModel = async (req, res, next) => {
    const model = {
        employee_name: req.body.employee_name,
        employee_role: req.body.employee_role,
        report_date: req.body.report_date,
        prod_name: req.body.prod_name,
        prod_text: req.body.prod_text,
        prod_code: req.body.prod_code,
        prod_developer: req.body.prod_developer,
        prod_releaser: req.body.prod_releaser,
        prod_description: req.body.prod_description,
        prod_develop_date_start: req.body.prod_develop_date_start,
        prod_develop_date_end: req.body.prod_develop_date_end,
        prod_chr1: req.body.prod_chr1,
        prod_chr2: req.body.prod_chr2,
        prod_file: req.body.prod_file,
        consignment: req.body.consignment,
        selection: req.body.selection
    };
    emptyToNull(model);
    
    try {
        const data = await partService.addModel(model);
        res.send(data);
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}


const addRef = async (req, res, next) => {
    let partId = req.body.partId;
    
    const models = [];

    for (const ref of req.body.data) {
        models.push({
            partId,
            name: ref['name'],
            value: ref['value'],
            threshold: ref['threshold']
        })
    }

    let ids = [];

    for (const model of models) {
        emptyToNull(model);
        
        try {
            const data = await partService.addReference(model);
            ids.push(data);
        } catch(e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
    
    next();
}

const addFact = async (req, res, next) => {
    let partId = req.body.partId;
    
    const models = [];

    for (const fact of req.body.data) {
        models.push({
            partId,
            values: fact
        })
    }

    let ids = [];

    for (const model of models) {
        emptyToNull(model);
        
        try {
            const data = await partService.addFact(model);
            ids.push(data);
        } catch(e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
    
    next();
}



const editModel = async (req, res, next) => {
    const model = {
        id: req.params["id"],
        name: req.body.name,
        description: req.body.description,
        photopath: req.files[0]?.path ?? req.file.path,
        filepath: req.files[1]?.path
    };
    
    try {
        const data = await partService.editModel(model);
        res.send(data);
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}

const deleteModel = async (req, res, next) => {
    try {
        const data = await partService.deleteModel(req.params["id"]);
        res.send(data);
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}


export default {
    getModels,
    getModel,
    addModel,
    addRef,
    addFact
}