import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Stack;

public class IfThenElseSyntaxChecker {

    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("Usage: java IfThenElseSyntaxChecker <JavaFilePath>");
            return;
        }

        String filePath = args[0];

        try {
            if (checkIfElseSyntax(filePath)){
                System.out.println("if-then-else syntax is correct.");
            } else {
                System.out.println("if-then-else syntax errors found.");
            }
        } catch (IOException e) {
            System.out.println("Error reading the file: " + e.getMessage());
        }
    }

    public void testSyntaxChecker() {

        if(true
    }

    public static boolean checkIfElseSyntax(String filePath) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(filePath));
        String line;
        Stack<String> ifStack = new Stack<>();
        boolean syntaxIsValid = true;

        // Regex patterns for detecting "if", "else if", and "else"
        String ifPattern = "\\s*if\\s*\\(.*\\)\\s*\\{?.*";
        String elseIfPattern = "\\s*else\\s+if\\s*\\(.*\\)\\s*\\{?.*";
        String elsePattern = "\\s*else\\s*\\{?.*";
        
        while ((line = reader.readLine()) != null) {
            line = line.trim();

            if (line.matches(ifPattern)) {
                System.out.println("MATCHED IF");
                ifStack.push("if");
            } else if (line.matches(elseIfPattern)) {
                System.out.println("MATCHED IF ELSE");
                if (ifStack.isEmpty() || (!ifStack.peek().equals("if") && !ifStack.peek().equals("else"))) {
                    System.out.println("Error: 'else if' without matching 'if'");
                    syntaxIsValid = false;
                } else {
                    ifStack.push("else if");
                }
            } else if (line.matches(elsePattern)) {
                System.out.println("MATCHED ELSE");
                if (ifStack.isEmpty() || (!ifStack.peek().equals("if") && !ifStack.peek().equals("else if"))) {
                    System.out.println("Error: 'else' without matching 'if' or 'else if'");
                    syntaxIsValid = false;
                } else {
                    ifStack.push("else");
                }
            }

            // Check for unmatched brackets if applicable
            if (line.contains("}")) {
                if (!ifStack.isEmpty()) {
                    ifStack.pop();  // Close the matching if/else block
                }
            }
        }

        reader.close();

        // If there are unmatched "if"s left in the stack, it's an error
        if (!ifStack.isEmpty()) {
            System.out.println("Error: unmatched 'if' statement(s) found.");
            syntaxIsValid = false;
        }

        return syntaxIsValid;
    }
}
