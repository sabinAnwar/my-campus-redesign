# WCAG AAA Token Report

This document records the WCAG AAA contrast results for the design tokens
defined in `app/app.css` (`:root` and `.dark`). The report validates common
foreground/background pairs used by the UI semantic tokens.

## Method

Contrast ratios were calculated from HSL token values resolved from CSS
variables in `app/app.css`. The process follows WCAG 2.x contrast guidance:

1) Resolve CSS variables (e.g., `--primary: var(--iu-blue)`).
2) Convert HSL to sRGB.
3) Convert sRGB to linear RGB:
   - If `c <= 0.03928`, then `c_linear = c / 12.92`
   - Else `c_linear = ((c + 0.055) / 1.055) ^ 2.4`
4) Relative luminance:
   - `L = 0.2126 * R + 0.7152 * G + 0.0722 * B`
5) Contrast ratio:
   - `(L1 + 0.05) / (L2 + 0.05)` with `L1 >= L2`

The check includes the following pairs:

- `foreground` on `background`
- `card-foreground` on `card`
- `popover-foreground` on `popover`
- `primary-foreground` on `primary`
- `secondary-foreground` on `secondary`
- `muted-foreground` on `muted`
- `accent-foreground` on `accent`
- `destructive-foreground` on `destructive`
- `success-foreground` on `success`
- `warning-foreground` on `warning`
- `link` on `background`

AAA pass threshold: 7.0:1.

## Report

```
Theme: light
  foreground             on background          15.20  AAA:PASS
  card-foreground        on card                16.71  AAA:PASS
  popover-foreground     on popover             16.71  AAA:PASS
  primary-foreground     on primary             11.91  AAA:PASS
  secondary-foreground   on secondary           16.13  AAA:PASS
  muted-foreground       on muted                9.72  AAA:PASS
  accent-foreground      on accent              16.13  AAA:PASS
  destructive-foreground on destructive         10.24  AAA:PASS
  success-foreground     on success              8.58  AAA:PASS
  warning-foreground     on warning             10.15  AAA:PASS
  link                   on background          10.84  AAA:PASS

Theme: dark
  foreground             on background          21.00  AAA:PASS
  card-foreground        on card                19.78  AAA:PASS
  popover-foreground     on popover             19.78  AAA:PASS
  primary-foreground     on primary             14.74  AAA:PASS
  secondary-foreground   on secondary           17.49  AAA:PASS
  muted-foreground       on muted                9.41  AAA:PASS
  accent-foreground      on accent              18.76  AAA:PASS
  destructive-foreground on destructive         13.89  AAA:PASS
  success-foreground     on success              9.58  AAA:PASS
  warning-foreground     on warning             11.14  AAA:PASS
  link                   on background           9.96  AAA:PASS
```

## Notes

- This report covers semantic token pairs only. Component-specific color
  combinations should be audited separately if they do not use these tokens.
- If token values in `app/app.css` change, rerun the report and update this
  document.

## IU Token Changes (AAA Adjustments)

The IU brand color tokens were darkened to meet AAA on light backgrounds and
to ensure consistent contrast in dark mode. Values below reflect the current
tokens in `app/app.css`.

Light/Global tokens:
```
--iu-blue:   223 70% 28%
--iu-pink:   312 100% 30%
--iu-orange: 29 90% 28%
--iu-green:  132 55% 26%
--iu-red:    349 85% 28%
--iu-purple: 262 60% 32%
```

Dark theme tokens:
```
--primary:    223 60% 20%
--destructive: 349 80% 20%
--success:    142 55% 20%
--warning:     28 80% 20%
```

Related semantic adjustments:
```
--muted-foreground: 240 3% 25%    (light)
--muted-foreground: 0 0% 72%      (dark)
--link: var(--iu-blue)            (light)
--link: 210 100% 72%              (dark)
```
