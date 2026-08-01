from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class PublicCaretIntegrationTests(unittest.TestCase):
    def test_live_text_updates_can_preserve_native_caret(self):
        runtime = (ROOT / "content-runtime.js").read_text(encoding="utf-8")
        self.assertIn("function setText(key, html, options = {})", runtime)
        self.assertIn("options.render !== false", runtime)


if __name__ == "__main__":
    unittest.main()
