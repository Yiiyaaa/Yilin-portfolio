# Visual Editor Design

## Goal

Give Yilin a private, immersive editing surface that renders the real portfolio and supports direct text/image editing plus section/card ordering, while keeping the public GitHub Pages site clean and unchanged until an explicit publish.

## Requirements

- The editor must show the same `index.html`, CSS, assets, responsive layout, and motion as the public site.
- Text, labels, links, captions, and images can be edited in place.
- Main sections and repeatable card groups can be reordered without rewriting layout HTML.
- Drafts remain local. Publishing is an explicit action and must not stage unrelated files such as `deliverables/`.
- The public page must not contain editor controls or expose a write endpoint.
- Existing content and visual output must remain byte-for-byte equivalent when the content override file is empty.
- The local service binds only to `127.0.0.1` and protects write endpoints with a random session token.

## Architecture

The public project gains a tiny synchronous content layer: `content-data.js` stores text, image, and ordering overrides; `content-runtime.js` assigns deterministic edit keys, applies overrides, and reorders existing DOM nodes before the site's current animation script runs. With empty data, it is a no-op.

The editor is a separate local-only project at `D:\AI\Projects\personal-site\Yilin-editor`. It serves the real portfolio inside a full-viewport iframe and adds an ivory/champagne control rail. The rail communicates with the iframe through same-origin DOM access. A Python standard-library server saves validated draft data, accepts local image uploads, synchronizes the mirror copy, and publishes only approved content files through Git.

## ADR-001: Overlay data instead of serializing edited DOM

**Decision:** Persist a small override object and apply it before the existing page scripts.

**Alternatives considered:**

1. Save the live edited DOM. Rejected because the current page mutates headings for reveal animations and injects evidence galleries; serializing that DOM would permanently store generated markup.
2. Extract the entire site into a CMS schema. Rejected for the first version because it is a large rewrite and would make the portfolio harder to maintain.
3. Apply source-code regex replacements. Rejected because nested markup, emphasized text, and future copy changes make it fragile.

**Trade-off:** Deterministic keys depend on the original source structure. Manual structural edits to `index.html` may require reviewing the override data, but ordinary visual-editor changes are stable because ordering changes only the runtime DOM.

## Security and failure handling

- Listen on loopback only; never expose the editor server to the LAN.
- Require an unguessable token on every state-changing request.
- Accept only supported image MIME types with a conservative size limit.
- Normalize filenames and write only below `assets/`.
- Save data atomically through a temporary file replacement.
- Refuse publish when Git reports conflicting or unrelated tracked changes.
- Keep Git history as the rollback mechanism; provide a local “restore published” action.
- Show mirror-sync, save, validation, Git, and network failures in the editor instead of claiming success.

## Validation

- Python unit tests cover state validation, atomic persistence, upload boundaries, Git staging scope, and HTML shell responses.
- `node --check` validates both runtime and editor JavaScript.
- Static assertions verify the content layer loads before the existing animation script.
- Local HTTP smoke tests verify the public page, editor shell, state API, and draft save round trip.
- A real-browser screenshot is reviewed at desktop width, followed by a reduced-width check.
