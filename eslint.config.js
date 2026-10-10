import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'

export default defineConfig([
    {
        name: 'app/files-to-lint',
        // 👈 تم إضافة ملفات الـ .ts و .tsx لتشملها عملية الفحص والتحليل
        files: ['**/*.{ts,tsx,vue,js,mjs,jsx}'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tseslint.parser,
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'no-unused-vars': 'off',
            'vue/no-unused-vars': 'off',
        },
    },

    globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

    js.configs.recommended,
    ...pluginVue.configs['flat/essential'],

    ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

    skipFormatting,
])
