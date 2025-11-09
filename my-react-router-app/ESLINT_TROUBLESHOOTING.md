# 🔧 ESLint Not Showing Errors? Fix It!

## Quick Fix Steps:

### 1. Restart ESLint Server
Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and type:
```
ESLint: Restart ESLint Server
```

### 2. Reload VS Code Window
Press `Ctrl+Shift+P` and type:
```
Developer: Reload Window
```

### 3. Check ESLint Output
1. Go to `View` → `Output` (or press `Ctrl+Shift+U`)
2. In the dropdown at the top right, select `ESLint`
3. Look for any errors in the output

### 4. Verify Extension is Active
1. Click the Extensions icon (or press `Ctrl+Shift+X`)
2. Search for "ESLint"
3. Make sure `dbaeumer.vscode-eslint` is installed and enabled

## Visual Indicators:

Once working, you should see:

### ✅ Squiggly Lines
- **Red squiggly** = Error
- **Yellow squiggly** = Warning
- **Blue squiggly** = Info

### ✅ Problems Panel
- Bottom of VS Code shows error/warning count
- Click to see full list
- Example: `⚠ 1 ⓧ 0`

### ✅ Hover Tooltips
Hover over squiggly lines to see:
```
React Hook useMemo has missing dependencies
eslint(react-hooks/exhaustive-deps)
```

## Test File: notenverwaltung.jsx

Your file currently has 1 warning on **line 445**:
```
React Hook useMemo has missing dependencies: 
'moduleMatches' and 'sortedModules'
```

You should see a **yellow squiggly line** under the `useMemo` hook.

## Still Not Working?

### Check Settings
1. Open Settings (`Ctrl+,`)
2. Search for "eslint"
3. Verify these are enabled:
   - ✅ `Eslint: Enable`
   - ✅ `Eslint: Run` = "onType"
   - ✅ `Eslint > Validate` includes "javascript" and "javascriptreact"

### Manual Check
Run in terminal:
```bash
npm run lint app/routes/notenverwaltung.jsx
```

If this shows errors but VS Code doesn't, the extension needs restarting.

### Nuclear Option - Reinstall Extension
1. Uninstall ESLint extension
2. Reload VS Code
3. Reinstall ESLint extension
4. Reload VS Code again

## Expected Result:

After following these steps, you should see:
- Yellow squiggly line on line 445 in `notenverwaltung.jsx`
- Warning in Problems panel (bottom of screen)
- Hover tooltip showing the warning message
- ESLint icon in status bar (bottom right)

---

**Pro Tip**: After any configuration change to `.vscode/settings.json` or `eslint.config.js`, always restart the ESLint server!
