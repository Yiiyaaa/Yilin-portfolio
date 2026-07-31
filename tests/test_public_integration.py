from pathlib import Path
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

    def test_initial_override_data_is_empty(self):
        data = (ROOT / "content-data.js").read_text(encoding="utf-8")
        self.assertIn('"text": {}', data)
        self.assertIn('"images": {}', data)
        self.assertIn('"orders": {}', data)

    def test_runtime_exposes_editor_bridge(self):
        runtime = (ROOT / "content-runtime.js").read_text(encoding="utf-8")
        self.assertIn("window.YilinContentEditor", runtime)
        self.assertIn("describeSelection", runtime)
        self.assertIn("applySectionOrder", runtime)


if __name__ == "__main__":
    unittest.main()
