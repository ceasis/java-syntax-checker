import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.File;

public class JavaSyntaxChecker {

    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("Usage: java JavaSyntaxChecker <JavaFilePath>");
            return;
        }

        String filePath = args[0];
        File javaFile = new File(filePath);

        if (!javaFile.exists()) {
            System.out.println("Error: File not found!");
            return;
        }

        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();

        if (compiler == null) {
            System.out.println("Error: Java compiler not available. Make sure you are using a JDK, not a JRE.");
            return;
        }

        int result = compiler.run(null, null, null, javaFile.getPath());

        if (result == 0) {
            System.out.println("Syntax is correct.");
        } else {
            System.out.println("Syntax errors found.");
        }
    }
}
