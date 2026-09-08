import type { LanguageRegistration, ShikiSetupReturn } from "@slidev/types";
import { defineShikiSetup } from "@slidev/types";

// Shiki に rego のバンドル文法が無いため最小の TextMate 文法をここで登録する。
// Slidev は JS 正規表現エンジンで評価するので Oniguruma 固有の記法は使えない
const rego: LanguageRegistration = {
  name: "rego",
  scopeName: "source.rego",
  patterns: [
    { name: "comment.line.number-sign.rego", match: "#.*$" },
    {
      name: "string.quoted.double.rego",
      begin: '"',
      end: '"',
      patterns: [{ name: "constant.character.escape.rego", match: "\\\\." }],
    },
    { name: "string.quoted.raw.rego", begin: "`", end: "`" },
    {
      name: "keyword.control.rego",
      match:
        "\\b(package|import|if|else|contains|some|every|in|not|with|as|default)\\b",
    },
    { name: "constant.language.rego", match: "\\b(true|false|null)\\b" },
    { name: "constant.numeric.rego", match: "\\b[0-9]+(\\.[0-9]+)?\\b" },
    { name: "variable.language.rego", match: "\\b(input|data)\\b" },
    {
      name: "entity.name.function.rego",
      match: "\\b[A-Za-z_][A-Za-z0-9_.]*(?=\\()",
    },
    { name: "keyword.operator.rego", match: ":=|==|!=|<=|>=|[<>+\\-*/%|&]" },
  ],
  repository: {},
};

export default defineShikiSetup((): ShikiSetupReturn => ({
  langs: [rego],
}));
