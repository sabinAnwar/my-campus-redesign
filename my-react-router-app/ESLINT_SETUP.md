# ESLint Configuration for GitHub Copilot

This project is configured with ESLint to provide better code quality and enhance GitHub Copilot suggestions.

## 🚀 Quick Start

### Run ESLint
```bash
# Check all files for issues
npm run lint

# Auto-fix issues where possible
npm run lint:fix
```

### VS Code Integration
ESLint is automatically enabled in VS Code with these features:
- ✅ Real-time error highlighting
- ✅ Auto-fix on save
- ✅ Inline suggestions
- ✅ Enhanced Copilot integration

## 📋 What's Configured

### Plugins & Rules
- **React**: JSX syntax, hooks rules, prop validation
- **React Hooks**: Ensures proper hooks usage
- **JSX A11y**: Accessibility best practices
- **ES2021**: Modern JavaScript features

### Key Rules
- **Unused Variables**: Warns about unused code (prefix with `_` to ignore)
- **Console Statements**: Only allows `console.warn`, `console.error`, `console.info`
- **React Hooks**: Enforces hooks rules and dependency arrays
- **No Debugger**: Warns about leftover debugger statements
- **Prefer Const**: Encourages immutability

## 🎯 GitHub Copilot Benefits

With ESLint configured, Copilot will:
1. **Suggest better code** that follows your project's style
2. **Avoid common mistakes** by understanding your rules
3. **Provide context-aware completions** based on your ESLint config
4. **Generate cleaner code** that passes linting

## 🔧 Customization

### Disable a Rule for One Line
```javascript
// eslint-disable-next-line no-console
console.log('This is allowed');
```

### Disable a Rule for Entire File
```javascript
/* eslint-disable no-console */
// All console.log in this file are allowed
```

### Ignore Unused Variables
```javascript
// Prefix with underscore
const _unusedVariable = 'ignored by ESLint';
const { data, _metadata } = response; // metadata is ignored
```

### Modify Rules
Edit `eslint.config.js` to change rules:
```javascript
rules: {
  'no-console': 'off', // Disable console warnings
  'prefer-const': 'error', // Make it an error instead of warning
}
```

## 📂 Files & Directories

### `.eslintignore`
Specifies which files/folders ESLint should skip:
- `node_modules/`
- `build/`
- Test files
- Config files
- Old/backup files

### `.vscode/settings.json`
VS Code settings for ESLint integration:
- Auto-fix on save
- Real-time linting
- Copilot enhancements

### `.vscode/extensions.json`
Recommended VS Code extensions:
- ESLint
- GitHub Copilot
- GitHub Copilot Chat
- Prisma
- Tailwind CSS

## 🐛 Common Issues

### ESLint not working in VS Code?
1. Install the ESLint extension: `dbaeumer.vscode-eslint`
2. Reload VS Code: `Ctrl+Shift+P` → "Reload Window"
3. Check output: `View` → `Output` → Select "ESLint" from dropdown

### Too many warnings?
1. Run `npm run lint:fix` to auto-fix
2. Add specific files to `.eslintignore`
3. Adjust rule severity in `eslint.config.js`

### Copilot not respecting ESLint rules?
1. Ensure ESLint extension is enabled
2. Restart Copilot: `Ctrl+Shift+P` → "GitHub Copilot: Restart"
3. Check that `eslint.config.js` exists in project root

## 📊 Current Project Status

Run `npm run lint` to see:
- Total errors: Issues that must be fixed
- Total warnings: Suggestions for improvement
- Auto-fixable: Issues that `--fix` can resolve

## 🎓 Learn More

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [GitHub Copilot Best Practices](https://docs.github.com/en/copilot)

---

**Note**: This configuration uses the new flat config format (`eslint.config.js`) introduced in ESLint v9.
