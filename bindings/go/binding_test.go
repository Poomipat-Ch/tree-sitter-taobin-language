package tree_sitter_taobin_language_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_taobin_language "github.com/tree-sitter/tree-sitter-taobin_language/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_taobin_language.Language())
	if language == nil {
		t.Errorf("Error loading Taobin Language grammar")
	}
}
