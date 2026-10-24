import parser from '@typescript-eslint/parser';
export default [{files:['src/**/*.ts','src/**/*.tsx'],languageOptions:{parser,parserOptions:{ecmaVersion:2020,sourceType:'module',ecmaFeatures:{jsx:true}}},rules:{'no-debugger':'error','no-unreachable':'error'}}];
