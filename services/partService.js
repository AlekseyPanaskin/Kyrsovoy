import supabase from "../configs/dbConfig.js";

const getModels = async () => {
    try {
        const {data, error} = await supabase
            .from('parts')
            .select();
            
        if (error) throw error
        return data
    } catch (e) {
        throw e
    }
}

const getModel = async id => {
    try {
        const {data, error} = await supabase
            .from('models')
            .select()
            .match({id});
            
        if (error) throw error
        return data
    } catch (e) {
        throw e
    }
}

const addModel = async model => {
    try {
        const {data, error} = await supabase
            .from('parts')
            .insert(model)

        if (error) throw error
        return data
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
    addModel
}