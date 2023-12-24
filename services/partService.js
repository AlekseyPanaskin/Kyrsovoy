import supabase from "../configs/dbConfig.js";
import path from "path";
import fs from "fs";
import { IndexViewModel } from "../viewModels/indexViewModel.js";
import { PartDetailsViewModel } from "../viewModels/partDetailsViewModel.js";

const getModels = async () => {
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

const getModelDetails = async id => {
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
                ...references.data.map(r => r['name'])
            ]
        },
        {
            values: [
                'Эталонные показатели',
                ...references.data.map(r => r['value'])
            ]
        },
        {
            values: [
                'Допуски',
                ...references.data.map(r => r['threshold'])
            ]
        }
    ]

    

    for (let i = 0; i < facts.data.length; i++) {
        const fact = facts.data[i];
        let isDefect = false;

        for (let j = 0; j < references.data.length; j++) {
            const ref = references.data[j];
            const factValue = fact['values'][j];

            if (Math.abs(factValue - ref['value']) > ref['threshold']) {
                isDefect = true;
                break;
            }
        }

        let row = {
            isDefect,
            values: [i+1, ...fact['values']]
        }

        refFactsTable.push(row);
    }

    let vm = new PartDetailsViewModel(part.data[0], references.data, facts.data, refFactsTable);

    return vm;
}

const addModel = async model => {
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

const editModel = async model => {
    try {
        const {data, error} = await supabase
            .from('models')
            .update(model)
            .match({id: model.id});

        if (error) throw error
        return data
    } catch (e) {
        throw e
    }
}

const deleteModel = async id => {
    try {
        const {data, error} = await supabase
            .from('models')
            .delete()
            .match({id});

        if (error) throw error
        return data
    } catch (e) {
        throw e
    }
}


export default {
    getModels,
    getModelDetails,
    addModel,
    addReference,
    addFact
}