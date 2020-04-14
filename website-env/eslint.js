module.exports = {
    parser: "babel-eslint",
    extends: ["react-app", "plugin:import/errors", "plugin:import/warnings"],
    env: { browser: false },
    plugins: ["mocha", "react-hooks", "prettier"],
    rules: {
      // This doesn't work for us because we use `inject-loader` for testing JS
      // files, and can't be automatically configured in webpack.config.js.
      "import/no-webpack-loader-syntax": "off",
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc"
          },
          pathGroups: [
            {
              pattern: "abstract-di/**",
              group: "external",
              position: "after"
            },
            {
              pattern: "core/**",
              group: "external",
              position: "after"
            },
            {
              pattern: "desktop/**",
              group: "external",
              position: "after"
            },
            {
              pattern: "support/**",
              group: "external",
              position: "after"
            },
            {
              pattern: "web/**",
              group: "external",
              position: "after"
            }
          ]
        }
      ],
      "mocha/no-exclusive-tests": "error",
      curly: ["error", "all"],
      // Prettier automatically uses the least amount of parens possible, so this
      // does more harm than good.
      "no-mixed-operators": "off",
      "no-unused-vars": "error",
      "no-duplicate-imports": "error",
      // Enforce that code is formatted with prettier.
      "prettier/prettier": "error",
      // Explicitly disallow debugging statements
      "no-debugger": "error",
      // Disallow return await blah(); which is not needed outside of try/catch
      "no-return-await": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  };
  