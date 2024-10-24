import mongoose from "mongoose";


const ruleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isCombined:{
        type:Boolean,
        required:true,
    },
    ruleString: {
        type: String,
        required: true,
    },
    fields:{
        type:Array,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps:true});

const Rule = mongoose.model('Rule', ruleSchema);
export {Rule};