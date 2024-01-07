import supabase from "../configs/dbConfig.js";
import path from "path";
import fs from "fs";
import { IndexViewModel } from "../viewModels/indexViewModel.js";
import { PartDetailsViewModel } from "../viewModels/partDetailsViewModel.js";

const getParts = async () => {
    const {data, error} = await supabase
        .from('parts')
        .select();
        
    if (error) throw error;

    let filesDir = path.join(path.dirname(process.argv[1]), 'public/storage/');
    let fileNames = fs.readdirSync(filesDir, {withFileTypes: true})
        .filter(item => !item.isDirectory())
        .map(item => item.name);

    let vms = [];

    for (const part of data) {
        let vm = new IndexViewModel(
            part['id'],
            part['prod_name'],
            part['prod_releaser'],
            new Date(part['report_date']).toLocaleDateString('ru-RU'),
            part['consignment'],
            part['selection'],
            fileNames.find(f => f == part['prod_file'])
        );

        vms.push(vm);
    }

    return vms;
}

const getPartDetails = async id => {
    const part = await supabase
        .from('parts')
        .select()
        .order('id')
        .match({id});
        
    if (part.error) throw part.error;

    const references = await supabase
        .from('references')
        .select()
        .order('id')
        .match({partId: id});
        
    if (references.error) throw references.error;

    const facts = await supabase
        .from('facts')
        .select()
        .order('id')
        .match({partId: id});
        
    if (facts.error) throw facts.error;


    let refFactsTable = [
        {
            
            values: [
                '№ экземпляра',
                ...[...references.data.map(r => r['name']), 'Брак', 'Комментарий']
            ]
        },
        {
            values: [
                'Эталонные показатели',
                ...[...references.data.map(r => r['value']), null, null]
            ]
        },
        {
            values: [
                'Допуски',
                ...[...references.data.map(r => r['threshold']), null, null]
            ]
        }
    ]

    

    for (let i = 0; i < facts.data.length; i++) {
        const fact = facts.data[i];
        let isDefect = false;

        if (fact['values']) {
            for (let j = 0; j < references.data.length; j++) {
                const ref = references.data[j];
                const factValue = fact['values'][j];
    
                if (fact['is_defect'] || Math.abs(factValue - ref['value']) - ref['threshold'] > 0.00000001) {
                    isDefect = true;
                    break;
                }
            }
        }

        let row = {
            isDefect,
            values: [i+1, ...(fact['values'] ?? Array(references.data.length).fill(null)), fact['is_defect'] ? "+": "-", fact['comment']]
        }

        refFactsTable.push(row);
    }

    let vm = new PartDetailsViewModel(part.data[0], references.data, facts.data, refFactsTable);

    return vm;
}

const addPart = async model => {
    try {
        const {data, error} = await supabase
            .from('parts')
            .insert(model)
            .select('id');

        if (error) throw error
        return data[0];
    } catch (e) {
        throw e
    }
}

const editPart = async model => {
    try {
        const {data, error} = await supabase
            .from('parts')
            .update(model)
            .match({id: model.id});

        if (error) throw error
        return "OK";
    } catch (e) {
        throw e
    }
}

const deletePart = async id => {
    try {
        const {data, error} = await supabase
            .from('parts')
            .delete()
            .match({id});

        if (error) throw error
        return data
    } catch (e) {
        throw e
    }
}

const addReference = async model => {
    try {
        const {data, error} = await supabase
            .from('references')
            .insert(model)
            .select('id');

        if (error) throw error
        return data[0];
    } catch (e) {
        throw e
    }
}

const editReference = async model => {
    try {
        const { error } = await supabase
            .from('references')
            .upsert(model);

        if (error) throw error
        return "OK";
    } catch (e) {
        throw e
    }
}

const addFact = async model => {
    try {
        const {data, error} = await supabase
            .from('facts')
            .insert(model)
            .select('id');

        if (error) throw error
        return data[0];
    } catch (e) {
        throw e
    }
}

const editFact = async model => {
    try {
        const {error} = await supabase
            .from('facts')
            .upsert(model);

        if (error) throw error
        return "OK";
    } catch (e) {
        throw e
    }
}


export default {
    getParts,
    getPartDetails,
    addPart,
    editPart,
    deletePart,
    addReference,
    editReference,
    addFact,
    editFact
}