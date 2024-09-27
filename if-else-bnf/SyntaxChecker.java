import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Stack;

public class SyntaxChecker {

    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("Usage: java BNFIfElseCheckerWithLineNumbers <JavaFilePath>");
            return;
        }

        String filePath = args[0];

        try {
            if (checkIfElseSyntax(filePath)) {
                System.out.println("if-then-else syntax is correct.");
            } else {
                System.out.println("if-then-else syntax errors found.");
            }
        } catch (IOException e) {
            System.out.println("Error reading the file: " + e.getMessage());
        }
    }

    // Function to parse and check if-then-else structure based on BNF grammar
    public static boolean checkIfElseSyntax(String filePath) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(filePath));
        String line;
        Stack<String> stack = new Stack<>();
        boolean insideIf = false;
        boolean expectElse = false; // flag to know if an else block is expected
        int lineNumber = 0; // Keep track of the line number

        while ((line = reader.readLine()) != null) {
            lineNumber++; // Increment line number on each read
            line = line.trim();

            if (line.startsWith("if (")) {
                stack.push("if");
                insideIf = true; // We are now inside an if block
                expectElse = true; // After an if block, we can expect an else
            } else if (line.startsWith("else if (")) {
                if (stack.isEmpty() || (!stack.peek().equals("if") && !stack.peek().equals("else if"))) {
                    System.out.println("Error on line " + lineNumber + ": 'else if' without matching 'if'");
                    reader.close();
                    return false;
                }
                stack.push("else if");
                expectElse = true; // After else-if, another else may come
            } else if (line.startsWith("else")) {
                if (stack.isEmpty() || (!stack.peek().equals("if") && !stack.peek().equals("else if"))) {
                    System.out.println("Error on line " + lineNumber + ": 'else' without matching 'if' or 'else if'");
                    reader.close();
                    return false;
                }
                stack.push("else");
                expectElse = false; // End of the if-else chain
            }

            // Handle single-line if or else statements without curly braces
            if (line.startsWith("if (") && !line.contains("{") && line.endsWith(";")) {
                stack.push("if");
                insideIf = false; // Since it's a single-line, no block is expected
                expectElse = true; // A single-line if allows an else after it
            } else if (line.startsWith("else") && !line.contains("{") && line.endsWith(";")) {
                if (stack.isEmpty() || (!stack.peek().equals("if") && !stack.peek().equals("else if"))) {
                    System.out.println("Error on line " + lineNumber + ": 'else' without matching 'if' or 'else if'");
                    reader.close();
                    return false;
                }
                expectElse = false; // No more else blocks expected
            }

            // Handle block ending
            if (line.equals("}")) {
                if (!stack.isEmpty()) {
                    stack.pop();  // Close the block
                } else {
                    System.out.println("Error on line " + lineNumber + ": Unmatched closing brace '}'");
                    reader.close();
                    return false;
                }
            }
        }

        reader.close();

        // At the end, if the stack is not empty, there's an unmatched block
        if (!stack.isEmpty()) {
            System.out.println("Error: Unmatched 'if' or 'else' block at the end of file");
            return false;
        }

        return true;
    }
}
