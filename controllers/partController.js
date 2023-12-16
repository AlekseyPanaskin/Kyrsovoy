import partService from '../services/partService.js';

const getModels = async (req, res, next) => {
    try {
        const data = await partService.getModels();
        res.send(data);
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}

const getModel = async (req, res, next) => {
    try {
        const data = await partService.getModel(req.params["id"]);
        res.send(data);
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
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
        prod_file: req.body.prod_file
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

function emptyToNull(obj) {
    Object.keys(obj).forEach(key => { 
        if (!obj[key] || obj[key] == '') {
            obj[key] = null
        }
    });
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
    addModel
}