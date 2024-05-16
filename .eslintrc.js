module.exports = {
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  plugins: ["import"],
  env: {
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  settings: {
    "import/parsers": { "@typescript-eslint/parser": [".ts"] },
    "import/resolver": { typescript: {} },
  },
  rules: {
    curly: ["error", "all"],
    eqeqeq: ["error", "smart"],
    "import/extensions": [
      "error",
      "never",
      {
        css: "always",
        svg: "always",
        json: "always",
      },
    ],
    "prefer-regex-literals": ["error", { disallowRedundantWrapping: false }],
    "import/order": [
      "error",
      {
        groups: [
          ["external", "builtin"],
          "internal",
          ["parent", "sibling", "index"],
        ],
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
    "max-classes-per-file": 0,
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: ["*"],
        next: ["block-like", "return", "class"],
      },
      {
        blankLine: "always",
        prev: ["block-like", "return", "class"],
        next: ["*"],
      },
      { blankLine: "any", prev: ["default"], next: ["case"] },
    ],
    "no-void": ["error", { allowAsStatement: true }],
    "no-console": "off",
    "import/no-default-export": "off",
    "import/prefer-default-export": "off",
    "import/no-cycle": "off",
    "import/no-extraneous-dependencies": "off",
    "no-useless-return": "off",
    "eslint-comments/no-unused-disable": "warn",
    "eslint-comments/no-unused-enable": "warn",
    "no-param-reassign": "off",
    "consistent-return": "off",
    "no-underscore-dangle": "off",
    "global-require": "off",
    "class-methods-use-this": "off",
    "no-shadow": "off",
    "no-restricted-syntax": "off",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/no-unused-vars": [
      "error", // or "error"
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/unified-signatures": "error",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: false },
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/restrict-template-expressions": [
      "off",
      { allowNumber: true, allowBoolean: true },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@playwright/test",
            importNames: ["test", "expect"],
            message: "Please use the exports from lib/fixtures instead.",
          },
        ],
      },
    ],
  },
  overrides: [
    {
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      files: ["./**/*.js"],
    },
  ],
}
