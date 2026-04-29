import { Check, Copy } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState, type ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  atomDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = !mounted ? true : resolvedTheme === 'dark'

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Copy to clipboard failed:', err)
    }
  }

  // Preprocess content to handle different LaTeX formats
  // AI models typically send math in \(...\) and \[...\] delimiters.
  // remark-math expects $...$ and $$...$$ delimiters.
  const preprocessMath = (text: string): string => {
    let result = text

    // Convert display math: \[...\] → $$...$$
    // Uses [\s\S] to match across newlines within the delimiters
    result = result.replace(/\\\[([\s\S]*?)\\\]/g, (_match, formula) => {
      return `$$${formula}$$`
    })

    // Convert inline math: \(...\) → $...$
    result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_match, formula) => {
      return `$${formula}$`
    })

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
        code({
          inline,
          className,
          children,
          ...props
        }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
          const match = /language-(\w+)/.exec(className || '')
          let language = match ? match[1] : ''
          const codeString = String(children).replace(/\n$/, '')

          const isTreeSection =
            language === 'tree' ||
            (!inline &&
              (!language || language === 'plaintext' || language === 'text') &&
              (codeString.includes('├──') ||
                codeString.includes('└──') ||
                /^tree\r?\n/i.test(codeString)))

          let displayLanguage = language
          if (isTreeSection) {
            displayLanguage = 'Plaintext'
            language = 'plaintext'
          }

          const renderAsBlock = !inline && (match || isTreeSection)

          return renderAsBlock ? (
            // BLOCK CODE (e.g. ```python print("hi") ```)
            <div
              className={`rounded-xl overflow-hidden my-5 border ${isDark ? 'border-gray-800 shadow-sm' : 'border-gray-200 shadow-md'} w-full`}
            >
              <div
                className={`px-4 py-2 flex justify-between items-center ${isDark ? 'bg-gray-800' : 'bg-gray-100 border-b border-gray-200'}`}
              >
                <span
                  className={`text-xs font-mono font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {displayLanguage}
                </span>
                <button
                  onClick={() => handleCopyCode(codeString)}
                  className={`flex items-center gap-1.5 text-xs transition-colors px-2.5 py-1.5 flex-shrink-0 cursor-pointer rounded-md ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-black hover:bg-gray-200 shadow-sm'}`}
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
              <div className="overflow-x-auto relative">
                <SyntaxHighlighter
                  {...props}
                  style={isDark ? atomDark : oneLight}
                  language={language}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: '1.25rem',
                    borderRadius: '0 0 0.75rem 0.75rem',
                    background: isDark ? undefined : '#fafafa', // explicit backgrounds to fit border
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            </div>
          ) : (
            // INLINE CODE (e.g. `const x = 1`)
            <code
              {...props}
              className="rounded-lg px-1.5 py-1.5 font-semibold text-sm"
            >
              {children}
            </code>
          )
        },
        // Style other markdown elements to match your theme
        h1: ({ ...props }) => (
          <h1
            className="text-2xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        h2: ({ ...props }) => (
          <h2
            className="text-xl font-semibold mt-3 mb-2 text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        h3: ({ ...props }) => (
          <h3
            className="text-lg font-medium mt-3 mb-2 text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        ul: ({ ...props }) => (
          <ul
            className="list-disc list-outside ml-6 mb-4 text-gray-800 dark:text-gray-300"
            {...props}
          />
        ),
        ol: ({ ...props }) => (
          <ol
            className="list-decimal list-outside ml-6 mb-4 text-gray-800 dark:text-gray-300"
            {...props}
          />
        ),
        li: ({ ...props }) => (
          <li className="mb-1 leading-relaxed" {...props} />
        ),
        p: ({ ...props }) => (
          <p
            className="mb-4 leading-relaxed break-words text-gray-800 dark:text-gray-300 tracking-normal"
            style={{ overflowWrap: 'anywhere' }}
            {...props}
          />
        ),
        a: ({ ...props }) => (
          <a
            className="text-blue-500 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-600 dark:text-gray-400"
            {...props}
          />
        ),
        table: ({ ...props }) => (
          <div className="overflow-x-auto my-4 -mx-1 px-1">
            <table
              className="border-collapse border border-border min-w-full w-max"
              {...props}
            />
          </div>
        ),
        th: ({ ...props }) => (
          <th
            className="border border-border px-4 py-2 bg-secondary font-semibold text-left whitespace-nowrap"
            {...props}
          />
        ),
        td: ({ ...props }) => (
          <td
            className="border border-border px-4 py-2 whitespace-nowrap"
            {...props}
          />
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  )
}
