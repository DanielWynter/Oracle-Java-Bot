package com.springboot.MyTodoList.tools;

import io.github.classgraph.ClassGraph;
import io.github.classgraph.ScanResult;
import io.github.classgraph.ClassInfo;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class PlantUmlGenerator {

    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.err.println("Usage: <outputDir> <comma-separated-packages>");
            System.exit(1);
        }

        String outputDir = args[0];
        String[] packages = args[1].split(",");

        for (String pkg : packages) {
            pkg = pkg.trim();
            if (!pkg.isEmpty()) {
                generateForPackage(pkg, outputDir);
            }
        }
    }

    private static void generateForPackage(String pkg, String outputDir) {
        System.out.println("Generating PlantUML for package: " + pkg);
        try (ScanResult scanResult = new ClassGraph().acceptPackages(pkg).enableAllInfo().scan()) {
            List<Class<?>> classes = new ArrayList<>();
            for (ClassInfo ci : scanResult.getAllClasses()) {
                try {
                    classes.add(ci.loadClass());
                } catch (Throwable t) {
                    // skip classes that fail to load
                }
            }

            if (classes.isEmpty()) {
                System.out.println("No classes found in package " + pkg);
                return;
            }

            File outDir = new File(outputDir);
            if (!outDir.exists()) {
                outDir.mkdirs();
            }

            String safeName = pkg.replaceAll("\\.", "_");
            File outFile = new File(outDir, safeName + ".puml");
            try (FileWriter fw = new FileWriter(outFile)) {
                fw.write("@startuml\n");
                fw.write("title " + pkg + " - generated class diagram\n\n");

                // write class declarations
                for (Class<?> c : classes) {
                    fw.write("class " + c.getSimpleName() + "\n");
                }
                fw.write("\n");

                // write associations based on fields
                for (Class<?> c : classes) {
                    Field[] fields = c.getDeclaredFields();
                    for (Field f : fields) {
                        Class<?> ft = f.getType();
                        // if field type is one of the scanned classes, add association
                        for (Class<?> target : classes) {
                            if (target.equals(ft)) {
                                fw.write(c.getSimpleName() + " --> " + target.getSimpleName() + " : " + f.getName() + "\n");
                            }
                        }
                    }
                }

                fw.write("@enduml\n");
                System.out.println("Wrote " + outFile.getAbsolutePath());
            }

        } catch (IOException e) {
            System.err.println("Error generating PlantUML for package " + pkg + ": " + e.getMessage());
        }
    }
}
