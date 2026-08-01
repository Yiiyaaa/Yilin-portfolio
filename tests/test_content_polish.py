from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


def content_state():
    source = (ROOT / "content-data.js").read_text(encoding="utf-8")
    match = re.search(r"window\.YILIN_SITE_CONTENT\s*=\s*(\{.*\})\s*;\s*$", source, re.S)
    return json.loads(match.group(1))


class ContentPolishTests(unittest.TestCase):
    def test_owner_keywords_replace_third_party_praise_without_shifting_keys(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        state = content_state()
        self.assertNotIn("他人对我的评价", html)
        self.assertIn('class="step keywords reveal"', html)
        self.assertEqual(state["text"]["text.0226"], "学习能力强")
        self.assertEqual(state["text"]["text.0227"], "有责任心")
        self.assertEqual(state["text"]["text.0228"], "高能动性")
        self.assertEqual(html.count('class="content-key-reserve"'), 2)

    def test_delivery_matrix_uses_the_four_owner_supplied_categories(self):
        state = content_state()["text"]
        self.assertEqual(state["text.0236"], "内容策略与知识产品")
        self.assertEqual(state["text.0239"], "AI 产品与工作流")
        self.assertEqual(state["text.0242"], "跨文化表达与本地化")
        self.assertEqual(state["text.0245"], "海外市场与产品营销")

    def test_completed_lab_entries_have_structured_copy_and_evidence(self):
        state = content_state()["text"]
        self.assertIn("<strong>产品设计</strong>", state["text.0166"])
        self.assertIn("<strong>今日总览</strong>", state["text.0201"])
        for relative in (
            "assets/gallery/lab-visionboard/lab-visionboard-01.png",
            "assets/gallery/lab-visionboard/lab-visionboard-02.png",
            "assets/gallery/lab-efficiency/lab-efficiency-01.png",
        ):
            self.assertTrue((ROOT / relative).is_file(), relative)

    def test_writing_metrics_are_evidence_backed_not_fabricated_engagement(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn("08", html)
        self.assertIn("Selected Pieces", html)
        self.assertIn("06", html)
        self.assertIn("Core Themes", html)
        self.assertNotIn("Followers", html)


if __name__ == "__main__":
    unittest.main()
