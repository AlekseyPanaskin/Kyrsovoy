import partService from '../services/partService.js';

const getPart = async (req, res, next) => {
    try {
        const vm = await partService.getPartDetails(req.params["id"]);
        
        if (!vm) {
            res.sendStatus(500);
        }

        if (!vm.part) {
            res.sendStatus(404);
        }

        res.render('details', {
            part: vm['part'],
            refs: vm['references'],
            facts: vm['facts'],
            table: vm['refFactsTable']
        });

        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}

const getParts = async (req, res, next) => {
    try {
        const partVMs = await partService.getParts();
        
        if (!partVMs) {
            res.sendStatus(500);
        }

        res.render('index', {
            vms: partVMs
        });
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}


const addPart = async (req, res, next) => {
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
        const data = await partService.addPart(model);
        res.send(data);
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}


const editPart = async (req, res, next) => {
    const model = {
        id: req.params["id"],
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
        const data = await partService.editPart(model);
        res.send(data);
        next();
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
}

const deletePart = async (req, res, next) => {
    try {
        const data = await partService.deletePart(req.params["id"]);
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


const editRef = async (req, res, next) => {
    let partId = req.body.partId;
    
    const models = [];

    for (const ref of req.body.data) {
        models.push({
            partId,
            id: ref['id'],
            name: ref['name'],
            value: ref['value'],
            threshold: ref['threshold']
        })
    }

    for (const model of models) {
        emptyToNull(model);
        
        try {
            const data = await partService.editReference(model);
        } catch(e) {
            console.error(e);
            res.sendStatus(500);
            return;
        }
    }
    
    res.sendStatus(200);
    next();
}


const addFact = async (req, res, next) => {
    let partId = req.body.partId;
    
    const models = [];

    if (req.body.data && req.body.data.length > 0) { 
        for (const fact of req.body.data) {
            models.push({
                partId,
                values: fact['values'],
                is_defect: fact['isDefect'],
                comment: fact['comment']
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
    }

    
    next();
}

const editFact = async (req, res, next) => {
    let partId = req.body.partId;
    
    const models = [];

    if (req.body.data && req.body.data.length > 0) { 
        for (const fact of req.body.data) {
            models.push({
                id: fact['id'],
                partId,
                values: fact['values'],
                is_defect: fact['isDefect'],
                comment: fact['comment']
            })
        }

        for (const model of models) {
            emptyToNull(model);
            
            try {
                const data = await partService.editFact(model);
            } catch(e) {
                console.error(e);
                res.sendStatus(500);
                return;
            }
        }
    }

    res.sendStatus(200);
    next();
}



function emptyToNull(obj) {
    Object.keys(obj).forEach(key => { 
        if (!obj[key] || obj[key] == '') {
            obj[key] = null
        }
    });
}


export default {
    getParts,
    getPart,
    addPart,
    editPart,
    deletePart,
    addRef,
    editRef,
    addFact,
    editFact
}