from pathlib import Path
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]

class GalleryRuntimeTests(unittest.TestCase):
    def test_gallery_scripts_load_after_content_runtime_and_before_page_animation(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertLess(html.index('content-runtime.js'), html.index('gallery-data.js'))
        self.assertLess(html.index('gallery-data.js'), html.index('gallery-runtime.js'))
        self.assertLess(html.index('gallery-runtime.js'), html.index('// ✦ 开场编排'))

    def test_manifest_has_every_managed_gallery_and_existing_assets(self):
        source = (ROOT / "gallery-data.js").read_text(encoding="utf-8")
        match = re.search(r"window\.YILIN_GALLERY_DATA\s*=\s*(\{.*\})\s*;\s*$", source, re.S)
        self.assertIsNotNone(match)
        state = json.loads(match.group(1))
        expected = {"writing", "commercial", "lab-jizi", "lab-naixu", "lab-duola", "lab-visionboard", "lab-comic", "lab-efficiency"}
        self.assertEqual(set(state["galleries"]), expected)
        for gallery in state["galleries"].values():
            for item in gallery["items"]:
                self.assertTrue((ROOT / item["src"]).is_file(), item["src"])

    def test_runtime_exposes_render_and_locate_bridge(self):
        source = (ROOT / "gallery-runtime.js").read_text(encoding="utf-8")
        self.assertIn("window.YilinGalleryEditor", source)
        self.assertIn("snapshot, apply, render, renderAll, locate", source)
        self.assertIn("textContent = item.caption", source)

if __name__ == "__main__":
    unittest.main()
