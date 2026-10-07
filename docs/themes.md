# Themes

Themes are **first-class extensions**, not CSS-only skins. They define how public (and optionally admin-adjacent) experiences render and behave.

## Structure (conceptual)

```text
theme/
  theme.json
  layouts/
  templates/
  components/
  blocks/
  styles/
  assets/
  config/
```

## Capabilities

- Parent and child themes
- Template and component overrides
- Blocks and layouts
- Theme settings, assets, hooks
- Custom frontend behavior

Rendering architecture (which framework, SSR/SSG strategy) is **not yet decided** - see [roadmap](roadmap.md).

## Override resolution

When multiple layers customize the same artifact:

```text
Site Override
      v
Child Theme
      v
Theme
      v
Plugin
      v
Platform Default
```

Applies to templates, components, services, configuration, presentation, and behavior where appropriate.

## Frontend independence

Themes may target a default official stack (candidates include Next.js or Astro), but the **backend must not** assume one frontend framework. API-first and alternate clients remain valid.

---

**Full detail:** [Foundation section 16-17 Overrides & themes](project-foundation-v0.1.md#16-override-resolution) | [section 18 Frontend independence](project-foundation-v0.1.md#18-frontend-framework-independence)
