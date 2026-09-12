# Migration audit — phase 1

Baseline: commit `1b1a4f6`; theme submodule `57c1fc627edcc358d083274593919074623e38ec`. Working tree initially clean except the user-owned untracked `Prompt`, which is excluded from migration commits.

## Repository inventory and ownership

- `config/_default`: Hugo, language menus and site parameters. `config/production`: upstream domain, obsolete analytics, robots and build statistics. `config/development`: local URL.
- `themes/dot-org-hugo-theme`: imported MIT-licensed CNCF theme; never edited. Supplies base/list/single templates, responsive header/footer, language selector, shortcodes, SCSS, JavaScript, fonts and default icons.
- `layouts`: 26 local templates. Overrides: homepage, head/custom-head, blog list/single, RSS. Site-specific additions: blog image/social/author pipeline, guides, studies, case studies and organisation shortcodes.
- `assets`: homepage SCSS plus blog banner, logo, font and its OFL notice.
- `content`: 308 Markdown files across English, Japanese and Chinese, including resources, blog, working groups and organisation pages. Some use external embeds and remote resources.
- `data`: authors, ambassadors and generated banner metrics. `i18n`: three language dictionaries.
- `static`: 114 files, mainly organisation images plus Netlify redirects. Theme contributes its own static files separately.
- `scripts/test-blog-images.py`, `docs/blog-images.md`: checks/documentation specific to upstream banner generation.
- `package.json`/lock: Hugo Extended, PostCSS/autoprefixer, Netlify CLI, Prettier and Go-template formatter. `Makefile`/`netlify.toml`: Netlify builds and Pagefind via unpinned npx. Shell scripts provide local/Docker serving. No existing GitHub Pages workflow.
- Root license: CC BY 4.0. Theme: MIT, CNCF copyright 2023. Retain both and document the adapted source. Font notices must accompany retained fonts.

## Executed baseline

Initial system Hugo 0.76.5 was too old. Initial sandbox build could not write Hugo cache. Initialised pinned theme and ran `npm ci`, then `npm run build` with installed Hugo Extended 0.126.1 and cache/network access.

Build passed: EN 239, JA 42, ZH-CN 59 pages; 257 processed images. One warning: obsolete Universal Analytics. Dependency audit reported 59 findings in the original toolchain; unnecessary Netlify CLI will be removed from local dependencies during cleanup.

## Migration decisions

Keep Hugo, the pinned theme, SCSS pipeline, bundled typefaces, Markdown and native translations. Root overrides adapt visual/navigation patterns and remove upstream assumptions. Native section types share cards and image handling. Portuguese uses `/`, English `/en/`; explicit shared translation keys make correspondence auditable. Source placeholders are hidden behind translated editorial status messages where appropriate. The requested founding year 1981 is user-supplied, not independently verified. No other association facts will be invented.

Use original SVG illustration placeholders (not purported historical stamps or an official logo); keep future image assets and licensing records obvious. Preserve the supplied `Prompt` file unchanged.
