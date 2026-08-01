from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


class PublicIntegrationTests(unittest.TestCase):
    def test_content_runtime_loads_before_main_animation(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        data_at = html.index('<script src="content-data.js"></script>')
        runtime_at = html.index('<script src="content-runtime.js"></script>')
        animation_at = html.index('// ✦ 开场编排')
        self.assertLess(data_at, runtime_at)
        self.assertLess(runtime_at, animation_at)

    def test_owner_content_data_is_valid_and_versioned(self):
        source = (ROOT / "content-data.js").read_text(encoding="utf-8")
        match = re.search(r"window\.YILIN_SITE_CONTENT\s*=\s*(\{.*\})\s*;\s*$", source, re.S)
        self.assertIsNotNone(match)
        state = json.loads(match.group(1))
        self.assertEqual(state["version"], 1)
        self.assertTrue(state["text"])
        self.assertEqual(state["images"], {})
        self.assertEqual(state["orders"], {})

    def test_runtime_exposes_editor_bridge(self):
        runtime = (ROOT / "content-runtime.js").read_text(encoding="utf-8")
        self.assertIn("window.YilinContentEditor", runtime)
        self.assertIn("describeSelection", runtime)
        self.assertIn("applySectionOrder", runtime)


if __name__ == "__main__":
    unittest.main()
