class Node {
    constructor(type, value = null, left = null, right = null) {
      this.type = type;
      this.value = value;
      this.left = left;
      this.right = right;
    }
  }
  
  function createRule(ruleString) {
    const tokens = tokenize(ruleString);
    let index = 0;
  
    function parseExpression() {
      let node = parseTerm();
      while (index < tokens.length && (tokens[index] === 'AND' || tokens[index] === 'OR')) {
        const operator = tokens[index++];
        const right = parseTerm();
        node = new Node('operator', operator, node, right);
      }
      return node;
    }
  
    function parseTerm() {
      if (tokens[index] === '(') {
        index++; 
        const node = parseExpression();
        index++; 
        return node;
      } else {
        const attribute = tokens[index++];
        const operator = tokens[index++];
        const value = tokens[index++];
        return new Node('operand', { attribute, operator, value });
      }
    }
  
    return parseExpression();
  }
  
  function tokenize(ruleString) {
    return ruleString.match(/\(|\)|AND|OR|>=|<=|[<>=]|\w+|\d+|'[^']*'|true|false/g);
  }
  
  function combineRules(rules) {
    if (rules.length === 0) return null;
    if (rules.length === 1) return rules[0];
    return rules.reduce((acc, rule) => new Node('operator', 'AND', acc, rule));
  }
  
  function evaluateRule(rule, data) {
    if (rule.type === 'operand') {
      const { attribute, operator, value } = rule.value;
      const dataValue = data[attribute];
      
      if (dataValue === undefined) {
        return false;
      }
  
      const typedValue = convertToType(value);
      const typedDataValue = convertToType(dataValue);
  
      switch (operator) {
        case '=':
          return typedDataValue === typedValue;
        case '>':
          return typedDataValue > typedValue;
        case '<':
          return typedDataValue < typedValue;
        case '>=':
          return typedDataValue >= typedValue;
        case '<=':
          return typedDataValue <= typedValue;
        default:
          return false;
      }
    } else if (rule.type === 'operator') {
      const leftResult = evaluateRule(rule.left, data);
      const rightResult = evaluateRule(rule.right, data);
      
      switch (rule.value) {
        case 'AND':
          return leftResult && rightResult;
        case 'OR':
          return leftResult || rightResult;
        default:
          return false;
      }
    }
    
    return false;
  }
  
  function convertToType(value) {
    if (value === undefined) return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(value)) return Number(value);
    return typeof value === 'string' ? value.replace(/'/g, '') : value;
  }
  
  export { Node, createRule, combineRules, evaluateRule };
  