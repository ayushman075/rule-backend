import express from 'express'
import bodyParser from 'body-parser'
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import { rateLimiter } from './services/rateLimiter.js';
import connection from './db/connect.js';
import { combineRules, createRule, evaluateRule } from './services/rule.service.js';
import { ruleRouter } from './routes/rule.route.js';


const app = express();

dotenv.config({
    path:'.env'
})

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:false,
    optionsSuccessStatus:200
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(rateLimiter)

app.use(express.static("public"));
app.use(cookieParser());

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

connection.then((resp)=>{
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      })
}).catch(()=>{
    console.log("Error connecting to database !!");
})

// // Test function
// function testRule(testName, ruleString, data, expectedResult) {
//     const parsedRule = createRule(ruleString);
//     const result = evaluateRule(parsedRule, data);
//     console.log(`Test: ${testName}`);
//     console.log(`Rule: ${ruleString}`);
//     console.log(`Data: ${JSON.stringify(data)}`);
//     console.log(`Expected: ${expectedResult}, Actual: ${result}`);
//     console.log(`Result: ${result === expectedResult ? 'PASS' : 'FAIL'}`);
//     console.log('---');
//   }
  
//   // Test cases
//   testRule(
//     "Simple AND condition",
//     "age > 30 AND department = 'Sales'",
//     { age: 35, department: 'Sales' },
//     true
//   );
  
//   testRule(
//     "Simple OR condition",
//     "age < 25 OR department = 'Marketing'",
//     { age: 30, department: 'Marketing' },
//     true
//   );
  
//   testRule(
//     "Nested AND/OR condition",
//     "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)",
//     { age: 35, department: 'Sales', salary: 60000, experience: 3 },
//     true
//   );
  
//   testRule(
//     "Complex nested condition",
//     "(age > 40 OR (experience > 10 AND department = 'Engineering')) AND (salary > 100000 OR (projects > 5 AND performance = 'Excellent'))",
//     { age: 38, experience: 15, department: 'Engineering', salary: 90000, projects: 7, performance: 'Excellent' },
//     true
//   );
  
//   testRule(
//     "Numeric comparisons",
//     "age >= 18 AND age <= 65 AND salary > 30000",
//     { age: 30, salary: 45000 },
//     true
//   );
  
//   testRule(
//     "String equality and numeric comparison",
//     "status = 'Active' AND (loginAttempts < 3 OR lastLogin > '2023-01-01')",
//     { status: 'Active', loginAttempts: 1, lastLogin: '2023-06-15' },
//     true
//   );
  
//   testRule(
//     "All conditions false",
//     "age > 60 AND salary > 100000 AND department = 'Executive'",
//     { age: 45, salary: 80000, department: 'Sales' },
//     false
//   );
  
//   testRule(
//     "Missing data fields",
//     "age > 30 AND department = 'Sales'",
//     { age: 35 },
//     false
//   );
  

  
//   testRule(
//     "Single condition true",
//     "isStudent = true",
//     { isStudent: true, age: 20 },
//     true
//   );
  
//   testRule(
//     "Single condition false",
//     "isStudent = true",
//     { isStudent: false, age: 30 },
//     false
//   );
  
//   testRule(
//     "Complex nested condition with multiple ANDs and ORs",
//     "((age > 25 AND age < 65) OR (experience > 5 AND department = 'IT')) AND ((salary > 50000 AND performance = 'Good') OR (projects > 3 AND rating > 4))",
//     { age: 30, experience: 3, department: 'IT', salary: 55000, performance: 'Good', projects: 2, rating: 4.5 },
//     true
//   );


//   function testCombineRules(testName, rules, testData, expectedResult) {
//     console.log(`Test: ${testName}`);
    
//     // Create rule objects
//     const ruleObjects = rules.map(createRule);
    
//     // Combine rules
//     const combinedRule = combineRules(ruleObjects);

//     const temp = rules.join(' AND ');
    
    
//     const parsedTemp = createRule(temp);
//     const tempResult = evaluateRule(parsedTemp, testData);
//     // Evaluate combined rule
//     const result = evaluateRule(combinedRule, testData);
    
//     console.log(`Rules: ${rules.join(' AND ')}`);
//     console.log(`Combined Rule Result: ${tempResult}`)
//     console.log(`Data: ${JSON.stringify(testData)}`);
//     console.log(`Expected: ${expectedResult}, Actual: ${result}`);
//     console.log(`Result: ${result === expectedResult ? 'PASS' : 'FAIL'}`);
//     console.log('---');
//   }
  
//   // Test cases
//   testCombineRules(
//     "Combine two simple rules",
//     ["age > 30", "salary > 50000"],
//     { age: 35, salary: 60000 },
//     true
//   );
  
//   testCombineRules(
//     "Combine three rules with mixed results",
//     ["age > 30", "salary > 50000", "department = 'Sales'"],
//     { age: 35, salary: 60000, department: 'Marketing' },
//     false
//   );
  
//   testCombineRules(
//     "Combine rules with nested conditions",
//     ["age > 30", "(department = 'Sales' AND age > 20)"],
//     { age: 35, department: 'Sales' },
//     true
//   );
  
//   testCombineRules(
//     "Combine rules with all conditions false",
//     ["age > 40", "salary > 100000", "experience > 10"],
//     { age: 35, salary: 60000, experience: 5 },
//     false
//   );
  
//   testCombineRules(
//     "Combine rules with missing data",
//     ["age > 30", "salary > 50000"],
//     { age: 35 },
//     false
//   );
  
//   testCombineRules(
//     "Combine complex nested rules",
//     [
//       "(age > 30 AND experience > 5) OR (age > 40 AND experience > 2)",
//       "salary > 60000 OR (department = 'Sales' AND salary > 50000)"
//     ],
//     { age: 45, experience: 3, salary: 55000, department: 'Sales' },
//     true
//   );
  
//   testCombineRules(
//     "Combine rules with boolean conditions",
//     ["isFullTime = true", "hasCertification = true"],
//     { isFullTime: true, hasCertification: false },
//     false
//   );
  
//   testCombineRules(
//     "Combine single rule (edge case)",
//     ["age > 30"],
//     { age: 35 },
//     true
//   );
  

app.use("/api/v1/rule",ruleRouter);


app.get('/', (req, res) => {
    res.send('Welcome to Ruli, on this line you are talking to Ruli server !!');
});

