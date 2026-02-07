import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import { Check, Copy } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Preprocess content to handle different LaTeX formats
  const preprocessMath = (text: string): string => {
    let result = text

    // First, handle display math with square brackets: [ ... ]
    // Replace [ ... ] with $$ ... $$
    result = result.replace(/\[\s*([^[\]]+)\s*\]/g, (match, formula) => {
      // Only if it contains LaTeX commands
      if (formula.includes('\\')) {
        return `$$${formula}$$`
      }
      return match
    })

    // Handle inline LaTeX: wrap lone LaTeX commands in $...$
    // Match LaTeX commands that aren't already in $ or $$
    const latexPattern =
      /(?<!\$)(?<!\$\$)(\\(?:mathbf\{[^}]+\}|theta|cdot|cos|sin|tan|ge|le|circ|quad|qquad|sqrt\{[^}]+\}|frac\{[^}]+\}\{[^}]+\}|[a-zA-Z]+))(?!\$)/g

    result = result.replace(latexPattern, '$$1$')

    return result
  }

  const processedContent = preprocessMath(content)

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[[rehypeKatex, { strict: false }]]}
      // 2. Custom Components (The Magic happens here)
      components={{
        // Handle Code Blocks
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const codeString = String(children).replace(/\n$/, '')

          return !inline && match ? (
            // BLOCK CODE (e.g. ```python print("hi") ```)
            <div className="rounded-md overflow-hidden my-2">
              <div className="bg-gray-800 px-4 py-1 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-mono">
                  {language}
                </span>
                <button
                  onClick={() => handleCopyCode(codeString)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                  aria-label="Copy code"
                >
                  {copiedCode === codeString ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <SyntaxHighlighter
                {...props}
                style={oneDark}
                language={language}
                PreTag="div"
                customStyle={{ margin: 0, borderRadius: '0 0 4px 4px' }}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          ) : (
            // INLINE CODE (e.g. `const x = 1`)
            <code
              {...props}
              className="bg-gray-200 text-red-500 rounded px-1 py-0.5 font-mono text-sm"
            >
              {children}
            </code>
          )
        },
        // Style other markdown elements to match your theme
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-semibold mt-3 mb-2" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-outside ml-6 mb-4" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-outside ml-6 mb-4" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        p: ({ node, ...props }) => (
          <p className="mb-4 leading-relaxed" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700"
            {...props}
          />
        ),
        table: ({ node, ...props }) => (
          <table
            className="border-collapse border border-gray-300 my-4 w-full"
            {...props}
          />
        ),
        th: ({ node, ...props }) => (
          <th
            className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 px-4 py-2" {...props} />
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  )
}
