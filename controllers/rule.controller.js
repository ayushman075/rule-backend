import { Rule } from "../models/rule.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { createRule,evaluateRule } from "../services/rule.service.js";

const create = asyncHandler(
     async (req,res) => {
        const { name, ruleString, fields } = req.body;

    if (!name || !ruleString || !Array.isArray(fields)) {
        return res.status(400).json(new ApiResponse(400,{},"Name, Rule, and Fields are required, Please try again !!"));
    }

    if(ruleString==""){
        return res.status(400).json(new ApiResponse(400,{},"Rule string cannot be empty, Please try again !!")); 
    }

    if(fields.length<1){
        return res.status(400).json(new ApiResponse(400,{},"Rule must contain one or more fields, Please try again !!"));

    }

    const newRule = new Rule({ name, ruleString, fields ,isCombined:false});
    await newRule.save();

  
    return res.status(201).json(new ApiResponse(201,newRule,'Rule created successfully !!'));
    }
)

const combine = asyncHandler(async (req,res)=>{
    const {name,rule1Id,rule2Id} = req.body;

    if(!name || !rule1Id || !rule2Id){
        return res.status(400).json(new ApiResponse(400,{},"Name and two rules are required, Please try again !!"));
 
    }

    const rule1 = await Rule.findById(rule1Id);
    const rule2 = await Rule.findById(rule2Id);

    if(!rule1){
        return res.status(404).json(new ApiResponse(400,{},"Rule 1 cannot be found, Please try again !!")); 
    }
    if(!rule2){
        return res.status(404).json(new ApiResponse(400,{},"Rule 2 cannot be found, Please try again !!")); 
    }

    const combinedRuleString = rule1.ruleString + " AND " + rule2.ruleString;

    const fields = [];

    rule1.fields?.map((field)=>{
        if(!fields.includes(field)){
            fields.push(field);
        }       
    })
    rule2.fields?.map((field)=>{
        if(!fields.includes(field)){
            fields.push(field);
        }       
    })

    const combinedRule = new Rule({ name, ruleString:combinedRuleString, fields ,isCombined:true});
    await combinedRule.save();

    return res.status(201).json(new ApiResponse(201,combinedRule,'Rule combined successfully !!'));

})

const evaluate = asyncHandler(async (req,res)=>{
    const {ruleId,data} = req.body;

    if(!ruleId || !data){
        return res.status(400).json(new ApiResponse(400,{},"Rule and Data are required, Please try again !!"));
    }

    const rule =await Rule.findById(ruleId);
    let result=false;

   
    try{
        const parsedRule = createRule(rule.ruleString);
        result = evaluateRule(parsedRule, data);
    }catch(error){
        console.log(error)
        return res.status(500).json(new ApiResponse(500,{error},"An error occurred while evaluating the data for given rule, Please try again !!"))
    }

    return res.status(201).json(new ApiResponse(201,{result:result},'Data evaluated successfully !!')); 

})

const getRuleById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!id){
        return res.status(400).json(new ApiResponse(400,{},"Rule ID is required, Please try again !!"));
    }

    const rule = await Rule.findById(id);

    if (!rule) {
        return res.status(404).json(new ApiResponse(404, {}, "Rule not found, Please try again !!"));
    }

    return res.status(200).json(new ApiResponse(200, rule, 'Rule retrieved successfully !!'));
});

const getRules = asyncHandler(async (req, res) => {
    const { page = 1, limit = 100 } = req.query;


    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

 
    if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid page number, Please try again !!"));
    }
    if (isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid limit number, Please try again !!"));
    }

    const rules = await Rule.find()
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .skip((pageNum - 1) * limitNum) // Skip the previous pages
        .limit(limitNum); // Limit the number of results


    const total = await Rule.countDocuments();

    return res.status(200).json(new ApiResponse(200, { total, rules }, 'Rules retrieved successfully !!'));
});


export {create,combine,evaluate,getRuleById,getRules}