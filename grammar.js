/**
 * @file Taobin scripting language for XML engine
 * @author kenta420 <poomipat.c@forth.co.th>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "taobin_language",

  rules: {
    source_file: ($) => choice($._tag_block, repeat($._statement)),

    _tag_block: ($) =>
      seq(
        field("tag_open", /<\w+>/),
        repeat(choice($._statement, $._tag_block)),
        field("tag_close", /<\/\w+>/),
      ),

    _statement: ($) =>
      choice(
        $.element_declaration,
        $.event_declaration,
        $.variable_assignment,
        $.conditional_statement,
        $.comment,
        $.include_statement,
      ),

    element_declaration: ($) =>
      seq(
        field("tag_open", /<\w+>/),
        field(
          "content",
          choice($.string_literal, $.number_literal, $.variable_reference),
        ),
        field("tag_close", /<\/\w+>/),
      ),

    event_declaration: ($) =>
      seq(
        field(
          "tag_open",
          /<(EventOpen|EventTimeout|EventSecurity|EventMachine|EventClick|EventUnitTest4)>/,
        ),
        repeat($._event_statement),
        field(
          "tag_close",
          /<\/(EventOpen|EventTimeout|EventSecurity|EventMachine|EventClick|EventUnitTest4)>/,
        ),
      ),

    _event_statement: ($) =>
      choice(
        $.variable_assignment,
        $.conditional_statement,
        $.comment,
        $.function_call,
        $.open_statement,
      ),

    variable_assignment: ($) =>
      seq(
        "Var",
        field("variable_name", choice($.identifier, $.path_identifier)),
        "=",
        field(
          "value",
          choice(
            $.string_literal,
            $.number_literal,
            $.variable_reference,
            $.expression,
          ),
        ),
      ),

    path_identifier: ($) => seq($.identifier, ".", $.identifier),

    expression: ($) =>
      choice(
        seq(
          $.variable_reference,
          "+",
          choice($.variable_reference, $.string_literal, $.number_literal),
        ),
        seq(
          $.variable_reference,
          "-",
          choice($.variable_reference, $.number_literal),
        ),
      ),

    conditional_statement: ($) =>
      seq(
        "If",
        field("condition", $.condition),
        "Then",
        repeat($._event_statement),
        optional(seq("Else", repeat($._event_statement))),
        "EndIf",
      ),

    condition: ($) =>
      choice(
        seq(
          $.variable_reference,
          "=",
          choice($.string_literal, $.number_literal, $.variable_reference),
        ),
        seq(
          $.variable_reference,
          ">",
          choice($.number_literal, $.variable_reference),
        ),
        seq(
          $.variable_reference,
          ">=",
          choice($.number_literal, $.variable_reference),
        ),
        seq(
          $.variable_reference,
          "<",
          choice($.number_literal, $.variable_reference),
        ),
        seq(
          $.variable_reference,
          "<=",
          choice($.number_literal, $.variable_reference),
        ),
      ),

    function_call: ($) =>
      seq(
        choice("INT", "SPLIT", "DEBUGVAR", "TimerReset", "Refresh"),
        optional(
          seq(
            field(
              "parameters",
              commaSep1(
                choice(
                  $.variable_reference,
                  $.string_literal,
                  $.number_literal,
                ),
              ),
            ),
          ),
        ),
      ),

    open_statement: ($) =>
      seq(
        "Open",
        field("target", choice($.string_literal, $.variable_reference)),
      ),

    include_statement: ($) =>
      seq(";include=", field("target", $.string_literal)),

    comment: ($) => seq(";", /.*/),

    identifier: ($) => /[A-Za-z_][A-Za-z0-9_]*/,

    variable_reference: ($) =>
      choice(
        seq(
          "Var(",
          field("variable_name", choice($.identifier, $.path_identifier)),
          ")",
        ),
        $.identifier,
      ),

    string_literal: ($) => seq('"', optional(/[^"]*/), '"'),

    number_literal: ($) => /[0-9]+/,
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
