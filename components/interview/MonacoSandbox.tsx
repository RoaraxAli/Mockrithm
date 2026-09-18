"use client";

import React from "react";
import Editor from "@monaco-editor/react";

interface MonacoSandboxProps {
  language: string;
  value: string;
  onChange: (val: string) => void;
  readOnly: boolean;
}

export const MonacoSandbox = React.memo(function MonacoSandbox({
  language,
  value,
  onChange,
  readOnly,
}: MonacoSandboxProps) {
  const monacoLang =
    language === "python" ? "python" :
    language === "javascript" || language === "typescript" ? "typescript" :
    language === "markdown" ? "markdown" :
    language === "latex" ? "latex" :
    language === "html" ? "html" :
    language === "css" ? "css" :
    language === "swift" ? "swift" :
    language === "java" || language === "kotlin" ? "java" :
    language === "cpp" || language === "c++" || language === "c" ? "cpp" :
    "text";

  return (
    <Editor
      height="650px"
      theme="vs-dark"
      language={monacoLang}
      value={value}
      onChange={(val) => onChange(val || "")}
      options={{
        minimap: { enabled: false },
        fontSize: 12,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: readOnly,
        theme: "vs-dark",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        wordWrap: "on"
      }}
    />
  );
});
MonacoSandbox.displayName = "MonacoSandbox";
