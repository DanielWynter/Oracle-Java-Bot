import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true }, // Le dice que entienda React (< />)
        ecmaVersion: "latest",
        sourceType: "module"
      },
    },
    rules: {
      "no-unused-vars": "off", // Apagamos esto para que no nos llene de basura la terminal
      "no-undef": "off",
      "no-console": "warn" // Solo nos va a avisar en amarillo si dejaste un console.log por ahí
    }
  }
];