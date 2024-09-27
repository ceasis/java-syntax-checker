// Get elements from the DOM
const tokensDiv = document.getElementById("tokens");
const stackDiv = document.getElementById("stack");
const parserDiv = document.getElementById("parser");
const startAnimationBtn = document.getElementById("startAnimation");
const sourceCodeInput = document.getElementById("sourceCode");

// Define Token Types
const TokenType = {
  IF: "IF",
  ELSE: "ELSE",
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",
  LEFT_BRACE: "LEFT_BRACE",
  RIGHT_BRACE: "RIGHT_BRACE",
  ASSIGNMENT: "ASSIGNMENT",
  NUMBER: "NUMBER",
  IDENTIFIER: "IDENTIFIER",
  LESS_THAN: "LESS_THAN",
  PLUS: "PLUS",
  SEMICOLON: "SEMICOLON",
  OTHER: "OTHER",
};

// List of predefined tokens for this example
const predefinedTokens = [
  { regex: /^if\b/, type: TokenType.IF },
  { regex: /^else\b/, type: TokenType.ELSE },
  { regex: /^\(/, type: TokenType.LEFT_PAREN },
  { regex: /^\)/, type: TokenType.RIGHT_PAREN },
  { regex: /^\{/, type: TokenType.LEFT_BRACE },
  { regex: /^\}/, type: TokenType.RIGHT_BRACE },
  { regex: /^=/, type: TokenType.ASSIGNMENT },
  { regex: /^\d+/, type: TokenType.NUMBER },
  { regex: /^[a-zA-Z_]\w*/, type: TokenType.IDENTIFIER },
  { regex: /^</, type: TokenType.LESS_THAN },
  { regex: /^\+/, type: TokenType.PLUS },
  { regex: /^;/, type: TokenType.SEMICOLON },
  { regex: /^\s+/, type: TokenType.OTHER }, // Whitespace - to be skipped
];

// Function to simulate lexical analysis
function lexicalAnalysis(code) {
  const tokens = [];
  let position = 0;
  let currentLine = 1;

  // Split code into lines for line number tracking
  const lines = code.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    currentLine = i + 1;
    while (line.length > 0) {
      let matchFound = false;

      for (const tokenDef of predefinedTokens) {
        const match = tokenDef.regex.exec(line);
        if (match) {
          const value = match[0];
          if (tokenDef.type !== TokenType.OTHER) {
            // Skip whitespace
            tokens.push({
              value: value,
              type: tokenDef.type,
              line: currentLine,
            });
          }
          position += value.length;
          line = line.slice(value.length);
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        // If no token is matched, skip the first character to prevent infinite loop
        line = line.slice(1);
      }
    }
  }

  return tokens;
}

// Function to update the stack display
function updateStackDisplay(stack) {
  stackDiv.innerHTML = ""; // Clear the previous stack display
  const reversedStack = [...stack].reverse(); // Display top of stack first
  reversedStack.forEach((item, index) => {
    const stackElem = document.createElement("div");
    stackElem.classList.add("stack-item");
    stackElem.innerText = item;
    stackDiv.appendChild(stackElem);
  });
}

// Function to visualize the tokens
function showTokens(tokens) {
  tokensDiv.innerHTML = ""; // Clear the previous tokens
  tokens.forEach((token, index) => {
    const tokenElem = document.createElement("div");
    tokenElem.classList.add("token");
    tokenElem.innerText = `${token.type}: "${token.value}"`;

    // Delay each token appearance
    setTimeout(() => {
      tokensDiv.appendChild(tokenElem);
    }, index * 100); // 500ms between each token
  });
}

// Function to simulate parsing process and check for errors
function showParser(tokens) {
  parserDiv.innerHTML = ""; // Clear previous parsed nodes
  const stack = [];
  let syntaxError = false;
  let lastIfIndex = -1; // Keep track of the last 'if' index for proper 'else' matching
  const parserActions = [];

  tokens.forEach((token, index) => {
    let action = "";

    if (token.type === TokenType.IF) {
      stack.push("IF");
      lastIfIndex = index;
      action = "Start If Block";
    } else if (token.type === TokenType.LEFT_PAREN) {
      stack.push("(");
      action = "Open Parenthesis (";
    } else if (token.type === TokenType.RIGHT_PAREN) {
      if (stack.length === 0 || stack.pop() !== "(") {
        syntaxError = true;
        action = `Syntax Error: Unmatched ')' at line ${token.line}`;
      } else {
        action = "Close Parenthesis )";
      }
    } else if (token.type === TokenType.LEFT_BRACE) {
      stack.push("{");
      action = "Open Block {";
    } else if (token.type === TokenType.RIGHT_BRACE) {
      if (stack.length === 0 || stack.pop() !== "{") {
        syntaxError = true;
        action = `Syntax Error: Unmatched '}' at line ${token.line}`;
      } else {
        action = "Close Block }";
        // After closing a block, check if the top of the stack is 'ELSE'
        if (stack.length > 0 && stack[stack.length - 1] === "ELSE") {
          stack.pop();
          action += " - End Else Block";
        }
      }
    } else if (token.type === TokenType.ELSE) {
      if (
        stack.length === 0 ||
        (stack[stack.length - 1] !== "IF" && stack[stack.length - 1] !== "}")
      ) {
        syntaxError = true;
        action = `Syntax Error: Else without matching if at line ${token.line}`;
      } else {
        action = "Else Block";
        // Replace the last 'IF' or '}' with 'ELSE' to indicate it's handled
        stack.pop();
        stack.push("ELSE");
      }
    } else {
      // For other tokens, no specific parser action
      action = `Token: ${token.type}`;
    }

    parserActions.push({ action: action, index: index });
  });

  // Function to process parser actions with animation
  parserActions.forEach((item, index) => {
    const parserElem = document.createElement("div");
    parserElem.classList.add("parser-node");

    setTimeout(() => {
      parserElem.innerText = item.action;
      // Highlight errors
      if (item.action.startsWith("Syntax Error")) {
        parserElem.classList.add("error");
      } else if (
        item.action.endsWith("Else Block") ||
        item.action === "Close Block } - End Else Block"
      ) {
        parserElem.classList.add("success");
      }
      parserDiv.appendChild(parserElem);
      // Update the stack display
      updateStackDisplay(stack);
    }, index * 500 + 3000); // Start parsing after tokens have been displayed
  });

  // Final check for unbalanced braces or parentheses
  setTimeout(() => {
    if (stack.length > 0 && !syntaxError) {
      syntaxError = true;
      alert("Syntax Error: Unmatched opening braces or parentheses.");
    } else if (!syntaxError) {
      alert("Parsing completed successfully with no syntax errors.");
    } else {
      alert("Parsing completed with syntax errors.");
    }
  }, parserActions.length * 500 + 3500); // Delay the completion alert
}

// Start the animation when button is clicked
startAnimationBtn.addEventListener("click", () => {
  const sourceCode = sourceCodeInput.value.trim(); // Get user input code
  const tokens = lexicalAnalysis(sourceCode); // Step 1: Tokenize the input
  showTokens(tokens); // Step 2: Show tokens in the first column
  showParser(tokens); // Step 3: Parse and show in the third column, while updating the stack in the second column
});
