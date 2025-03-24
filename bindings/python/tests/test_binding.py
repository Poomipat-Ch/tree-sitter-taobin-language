from unittest import TestCase

import tree_sitter
import tree_sitter_taobin_language


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_taobin_language.language())
        except Exception:
            self.fail("Error loading Taobin Language grammar")
