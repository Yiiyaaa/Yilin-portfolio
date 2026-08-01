# Hybrid Gallery Manager Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Build one image workflow that can be managed either inside the visual editor or through organized local folders.

**Architecture:** A static `gallery-data.js` manifest is the source of truth. A public runtime renders it and exposes an editor bridge; the local Python server validates and persists gallery mutations, while the owner drawer provides upload, edit, reorder, scan, locate, and soft-delete controls.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, Python standard library, unittest, GitHub Pages.

---

### Task 1: Public gallery manifest and runtime

**Files:** Create `gallery-data.js`, `gallery-runtime.js`; modify `index.html`; test `tests/test_gallery_runtime.py`.

1. Add failing tests for script order, complete migrated gallery data, and editor bridge methods.
2. Add the manifest containing all current writing, commercial, and Lab assets/captions.
3. Add runtime rendering and mark the two portfolio containers with stable gallery keys.
4. Replace Lab filename probing with manifest-driven evidence rendering.
5. Run public tests and JavaScript syntax checks.

### Task 2: Gallery persistence and safe file operations

**Files:** Modify `Yilin-editor/editor_server.py`; test `Yilin-editor/tests/test_editor_server.py`.

1. Add failing tests for manifest validation, nested safe paths, gallery upload, folder scan, and soft delete.
2. Implement atomic load/save for `gallery-data.js`.
3. Store uploads under `assets/gallery/<gallery>/` and scan only known folders.
4. Move deleted gallery assets into `Yilin-editor/.trash/`.
5. Expose authenticated gallery endpoints and run server tests.

### Task 3: Owner gallery drawer

**Files:** Modify `Yilin-editor/editor.html`, `editor.css`, `editor.js`; create `editor-gallery.js`; test `Yilin-editor/tests/test_editor_interactions.py`.

1. Add failing static interaction tests for all required controls.
2. Add a refined right-side image library drawer with gallery navigation, drop zone, item cards, caption and alt fields, ordering, locating, and deletion.
3. Connect actions to server endpoints and the iframe gallery bridge with autosave feedback.
4. Add accessible keyboard and reduced-motion behavior.
5. Run editor tests and JavaScript syntax checks.

### Task 4: Publishing, mirror sync, and documentation

**Files:** Modify `Yilin-editor/editor_server.py`, both READMEs, `HANDOFF.md` if necessary; test both suites.

1. Add failing tests proving publish stages only content/gallery data and referenced gallery assets/deletions.
2. Sync gallery scripts/data/assets to the mirror and handle removed assets explicitly.
3. Preserve the `deliverables/` exclusion and add the required co-author footer to editor-created commits.
4. Document the page workflow and folder workflow.
5. Run all tests and inspect Git changes.

### Task 5: Real-browser acceptance and release

1. Start the local editor against the real project.
2. Exercise upload, caption/alt editing, reorder, locate, delete, folder scan, and visitor preview with a disposable test image; undo/remove the disposable content afterward.
3. Verify desktop and mobile rendering and check new public images for accidental sensitive information before publishing.
4. Copy tested files into the canonical project/editor, sync the mirror, commit to `main`, push, and verify the live page.
