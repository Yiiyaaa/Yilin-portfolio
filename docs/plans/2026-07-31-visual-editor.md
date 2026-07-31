# Yilin Visual Editor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a private local WYSIWYG editor for the existing portfolio with text/image editing, section/card ordering, local drafts, and an explicit safe publish action.

**Architecture:** Add a no-op-by-default content override layer to the public static page, and keep all editing controls in a separate loopback-only Python application. Draft content lives in the local portfolio worktree; publication stages only the override file and editor-uploaded assets.

**Tech Stack:** Existing HTML/CSS/JavaScript, Python 3.12 standard library, Git/GitHub Pages, Node syntax checks, Python `unittest`.

---

### Task 1: Public content runtime

**Files:**
- Create: `content-data.js`
- Create: `content-runtime.js`
- Modify: `index.html`
- Test: `tests/test_public_integration.py`

1. Add a failing static integration test that expects the content data/runtime scripts before the existing animation script.
2. Run the test and confirm failure.
3. Implement deterministic text/image keys, override application, reorder groups, navigation order, and section renumbering.
4. Insert the scripts immediately before the current main inline script.
5. Run the static test and `node --check content-runtime.js`.

### Task 2: Loopback editing service

**Files:**
- Create: `Yilin-editor/editor_server.py`
- Create: `Yilin-editor/tests/test_editor_server.py`

1. Write failing unit tests for state validation, atomic state writes, image restrictions, and publish staging scope.
2. Implement a `ThreadingHTTPServer` bound to `127.0.0.1` with token-protected JSON endpoints.
3. Add state load/save, base64 image upload, mirror synchronization, Git status, restore, and publish functions.
4. Run the unit tests.

### Task 3: Immersive editor interface

**Files:**
- Create: `Yilin-editor/editor.html`
- Create: `Yilin-editor/editor.css`
- Create: `Yilin-editor/editor.js`

1. Build a full-viewport iframe containing the real portfolio.
2. Add a restrained champagne/ivory tool rail for save, preview, restore, and publish.
3. Add direct selection/content editing, image replacement, order lists, move-up/down controls, dirty-state tracking, and keyboard shortcuts.
4. Add accessible labels, focus states, reduced-motion support, and clear error/success feedback.
5. Run `node --check editor.js`.

### Task 4: One-click local startup and documentation

**Files:**
- Create: `Yilin-editor/start-editor.cmd`
- Create: `Yilin-editor/README.md`
- Modify: `README.md`

1. Add a double-click launcher that finds Python and starts the loopback editor.
2. Document draft, preview, publish, rollback, privacy, and shutdown behavior.
3. Add the editor location to the portfolio README without exposing editor code through GitHub Pages.

### Task 5: Verification and delivery

**Files:**
- Test: `tests/test_public_integration.py`
- Test: `Yilin-editor/tests/test_editor_server.py`

1. Run all Python tests and JavaScript syntax checks.
2. Start the editor against an isolated temporary repository and test state/upload APIs.
3. Start it against the real local portfolio and verify the empty override leaves the public page unchanged.
4. Capture and inspect desktop and narrow screenshots in a real browser.
5. Synchronize the verified files to the main project and mirror.
6. Commit the implementation with an English why-focused message and push only after final checks.
