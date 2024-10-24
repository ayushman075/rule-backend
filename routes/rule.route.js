import { Router } from "express";
import { combine, create, evaluate, getRuleById, getRules } from "../controllers/rule.controller.js";

const ruleRouter = Router();

ruleRouter.post('/create', create);
ruleRouter.post('/combine',combine);
ruleRouter.post('/evaluate',evaluate);
ruleRouter.get('/getById/:id', getRuleById);
ruleRouter.get('/get', getRules);

export {ruleRouter}