import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LuClipboard, LuClipboardCheck, LuFile, LuFileText } from 'react-icons/lu';
import { toast } from 'react-hot-toast';

const CodeBlock = ({ code, language }) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast.success("Copied to clipboard!");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative my-4 rounded-lg bg-gray-900 text-sm group">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg">
                <div className="flex items-center gap-2">
                    {language ? <LuFileText className="w-4 h-4 text-gray-400" /> : <LuFile className="w-4 h-4 text-gray-400" />}
                    <span className="text-xs text-gray-400 font-mono">{language || 'text'}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                    disabled={isCopied}
                >
                    {isCopied ? <LuClipboardCheck className="w-4 h-4 text-green-400" /> : <LuClipboard className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    customStyle={{ margin: 0, background: 'transparent' }}
                    codeTagProps={{ style: { fontFamily: '"Fira Code", monospace' } }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

const AIResponsePreview = ({ content }) => {
    const markdownComponents = {
        p: (paragraph) => {
            const { node } = paragraph;
            if (node.children[0].tagName === "code") {
                const child = node.children[0];
                const meta = child.properties.className?.[0] || '';
                const match = /language-(\w+)/.exec(meta);

                if (match) {
                    return <CodeBlock language={match[1]} code={String(child.children[0].value).replace(/\n$/, '')} />;
                }
            }
            return <p className="my-4 leading-relaxed">{paragraph.children}</p>;
        },
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')} />
            ) : (
                <code className="bg-gray-200 text-indigo-800 font-mono text-sm px-1.5 py-0.5 rounded-md" {...props}>
                    {children}
                </code>
            );
        },
        ul: ({ node, ...props }) => <ul className="list-disc list-inside my-4 pl-4 space-y-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-4 pl-4 space-y-2" {...props} />,
        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-6 border-b pb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold my-5 border-b pb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold my-4" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />,
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="prose prose-indigo lg:prose-lg max-w-none">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                >
                    {content}
                </Markdown>
            </div>
        </div>
    );
};

export default AIResponsePreview;