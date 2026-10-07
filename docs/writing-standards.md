# Writing standards (strict)

**This rule applies to repository documentation and tooling defaults:** all docs, templates, `.ai/` files, README, governance files, and (when code exists) **default** English strings in core, comments, log messages, and error text unless a listed exception applies. It does **not** apply to end-user content or i18n locale files (CMS must support Unicode).

## Where this policy is documented

Do **not** repeat a writing banner on every markdown file. Product and architecture docs should stay focused on JodKit.

Contributors find the rule in [CONTRIBUTING.md](../CONTRIBUTING.md). Enforcement is automated (Husky pre-commit, CI). Agents see [.ai/conventions.md](../.ai/conventions.md) and [AGENTS.md](../AGENTS.md).

## Keyboard-only characters

Use **only** characters you can type on a standard English QWERTY keyboard.

Permitted without asking:

- Letters `A-Z` / `a-z`
- Digits `0-9`
- Space
- Common punctuation, including:

```text
` ~ ! @ # $ % ^ & * ( ) _ + - = [ ] { } \ | ; : ' " , . < > / ?
```

Do **not** insert characters that require OS symbol palettes, mobile emoji keyboards, or copy-paste from typography sites.

## Never use (non-exhaustive)

| Do not use | Use instead |
|------------|-------------|
| Curly / smart quotes | Straight `'` and `"` |
| Em dash or en dash | `-` or `--` |
| Unicode ellipsis | Three ASCII periods `...` |
| Section sign | Write `section` (example: Foundation section 6) |
| Unicode arrows (down/right) | `v`, `\|`, or `->` in diagrams |
| Box-drawing tree characters | ASCII `+--`, `\|--`, `\` |
| Ellipsis character | `...` |
| Middle dot separator | `\|` or `-` |
| Emoji or pictographs | Plain words |
| Non-breaking spaces | Normal space |
| Decorative Unicode symbols | ASCII words or omit |

## Diagrams and ASCII art

Prefer plain ASCII in `text` fences and markdown:

```text
Site Override
      v
Child Theme
      v
Theme
```

Tree layouts:

```text
jodkit/
+-- packages/
|   +-- core
+-- modules/
```

## Exceptions (rare)

1. **URLs** in links may contain encoded or international characters.
2. **Quoted third-party material** inside a clearly marked quote block, if ASCII would change the meaning.
3. **Proper names** that officially include accents (use sparingly; prefer ASCII slug in paths and IDs).
4. **Internationalization and user-generated content** (locale JSON/PO files, CMS field values, theme copy, stored HTML) - Unicode required; ASCII-only rule does not apply to those paths when added (configure check script excludes if needed).

If you believe an exception is required, say so in the PR and update this file only with maintainer agreement.

## Pull requests and AI-generated content

- Reviewers should reject new non-keyboard characters in any file.
- AI agents must follow [.ai/conventions.md](../.ai/conventions.md) including this standard.
- When editing older docs, replace legacy Unicode with ASCII from the table above.

## Automated enforcement

- **Local:** `npm install` enables a Husky pre-commit hook that runs `npm run check:ascii -- --staged`.
- **CI:** GitHub Actions workflow `keyboard-only.yml` runs `npm run check:ascii -- --all` on pull requests and pushes to `main`.
- **Implementation:** [scripts/check-keyboard-only.mjs](../scripts/check-keyboard-only.mjs) and [scripts/ascii-check.config.json](../scripts/ascii-check.config.json).
- When `locales/` or `**/i18n/**` directories exist, add them to `ignoreFiles` or ignore globs in `ascii-check.config.json` so locale content is not scanned.

## Related

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [docs/README.md](README.md)
