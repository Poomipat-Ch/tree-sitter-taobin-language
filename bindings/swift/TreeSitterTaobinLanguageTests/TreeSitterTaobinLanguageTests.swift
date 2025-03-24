import XCTest
import SwiftTreeSitter
import TreeSitterTaobinLanguage

final class TreeSitterTaobinLanguageTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_taobin_language())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Taobin Language grammar")
    }
}
