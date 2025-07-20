import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

// Import markdown files directly from src directory
import buildingScalableBackendsContent from '../content/blog/building-scalable-backends.md?raw'
import optimizingDatabaseQueriesContent from '../content/blog/optimizing-database-queries.md?raw'
import secureApiDesignContent from '../content/blog/secure-api-design.md?raw'

interface BlogPost {
    slug: string
    title: string
    date: string
    readTime: string
    excerpt: string
    tags: string[]
    content: string
}

interface BlogPageProps {
    onNavigateBack?: () => void
}

export default function BlogPage({ onNavigateBack }: BlogPageProps) {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)

    // Blog post metadata with imported content
    const blogPosts = [
        {
            slug: 'building-scalable-backends',
            content: buildingScalableBackendsContent
        },
        {
            slug: 'optimizing-database-queries',
            content: optimizingDatabaseQueriesContent
        },
        {
            slug: 'secure-api-design',
            content: secureApiDesignContent
        }
    ]

    useEffect(() => {
        loadBlogPosts()
    }, [])

    const loadBlogPosts = async () => {
        try {
            const loadedPosts: BlogPost[] = []

            for (const post of blogPosts) {
                try {
                    console.log(`Processing post: ${post.slug}`)
                    const parsed = parseMarkdownWithFrontmatter(post.content)

                    loadedPosts.push({
                        slug: post.slug,
                        title: parsed.frontmatter.title || post.slug,
                        date: parsed.frontmatter.date || '',
                        readTime: parsed.frontmatter.readTime || '',
                        excerpt: parsed.frontmatter.excerpt || '',
                        tags: parsed.frontmatter.tags || [],
                        content: parsed.content
                    })

                    console.log(`Successfully processed: ${post.slug}`)
                } catch (error) {
                    console.error(`Error processing ${post.slug}:`, error)
                }
            }

            console.log(`Loaded ${loadedPosts.length} blog posts`)

            // Sort by date (newest first)
            loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            setPosts(loadedPosts)
        } catch (error) {
            console.error('Failed to load blog posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const parseMarkdownWithFrontmatter = (content: string) => {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
        const match = content.match(frontmatterRegex)

        if (match) {
            const frontmatterText = match[1]
            const markdownContent = match[2]

            // Parse YAML frontmatter (simple implementation)
            const frontmatter: any = {}
            frontmatterText.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':')
                if (colonIndex > 0) {
                    const key = line.slice(0, colonIndex).trim()
                    let value = line.slice(colonIndex + 1).trim()

                    // Remove quotes
                    if ((value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1)
                    }

                    // Parse arrays
                    if (value.startsWith('[') && value.endsWith(']')) {
                        frontmatter[key] = value.slice(1, -1).split(',').map(item =>
                            item.trim().replace(/^["']|["']$/g, '')
                        )
                    } else {
                        frontmatter[key] = value
                    }
                }
            })

            return { frontmatter, content: markdownContent }
        }

        return { frontmatter: {}, content }
    }

    const openPost = (post: BlogPost) => {
        setSelectedPost(post)
    }

    const closePost = () => {
        setSelectedPost(null)
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="terminal-command terminal-glow">
                    <span className="terminal-prompt">$</span> cat blog/*.md
                </div>
                <div className="pl-4">
                    <div className="terminal-output">Loading blog posts...</div>
                </div>
            </div>
        )
    }

    if (selectedPost) {
        return (
            <div className="space-y-4">
                <div className="terminal-command terminal-glow">
                    <span className="terminal-prompt">$</span> cat blog/{selectedPost.slug}.md
                </div>

                {/* Blog post content */}
                <div className="pl-4">
                    <div className="border border-gray-600 rounded p-6 bg-gray-800 bg-opacity-30">
                        {/* Post header */}
                        <div className="mb-6 border-b border-gray-600 pb-4">
                            <h1 className="terminal-accent font-bold text-2xl terminal-glow mb-2">
                                {selectedPost.title}
                            </h1>
                            <div className="terminal-output text-sm flex items-center gap-4">
                                <span>{selectedPost.date}</span>
                                <span>•</span>
                                <span>{selectedPost.readTime}</span>
                                {selectedPost.tags.length > 0 && (
                                    <>
                                        <span>•</span>
                                        <span className="terminal-green">
                                            {selectedPost.tags.join(', ')}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Markdown content */}
                        <div className="prose prose-invert prose-lg max-w-none blog-content">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                                components={{
                                    // Custom styling for markdown elements
                                    h1: ({ children }) => (
                                        <h1 className="terminal-accent text-2xl font-bold mb-4 terminal-glow">{children}</h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="terminal-accent text-xl font-bold mb-3 mt-6 terminal-glow">{children}</h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="terminal-accent text-lg font-bold mb-2 mt-4">{children}</h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="terminal-output mb-4 leading-relaxed">{children}</p>
                                    ),
                                    code: ({ children, className }) => {
                                        const isInline = !className
                                        return isInline ? (
                                            <code className="bg-gray-700 text-terminal-accent px-1 py-0.5 rounded text-sm">
                                                {children}
                                            </code>
                                        ) : (
                                            <code className={className}>{children}</code>
                                        )
                                    },
                                    pre: ({ children }) => (
                                        <pre className="bg-gray-900 border border-gray-600 rounded p-4 overflow-x-auto mb-4 text-sm">
                                            {children}
                                        </pre>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="terminal-output list-disc list-inside mb-4 space-y-1">{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="terminal-output list-decimal list-inside mb-4 space-y-1">{children}</ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="terminal-output">{children}</li>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-terminal-accent pl-4 italic terminal-output mb-4">
                                            {children}
                                        </blockquote>
                                    ),
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="terminal-accent hover:terminal-accent-hover underline transition-colors"
                                        >
                                            {children}
                                        </a>
                                    ),
                                    table: ({ children }) => (
                                        <div className="overflow-x-auto mb-4">
                                            <table className="min-w-full border border-gray-600">{children}</table>
                                        </div>
                                    ),
                                    thead: ({ children }) => (
                                        <thead className="bg-gray-800">{children}</thead>
                                    ),
                                    th: ({ children }) => (
                                        <th className="border border-gray-600 px-4 py-2 text-left terminal-accent font-bold">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="border border-gray-600 px-4 py-2 terminal-output">
                                            {children}
                                        </td>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="terminal-accent font-bold">{children}</strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="text-yellow-400 italic">{children}</em>
                                    )
                                }}
                            >
                                {selectedPost.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="terminal-output text-sm mt-6">
                    <button
                        onClick={closePost}
                        className="terminal-accent hover:terminal-accent-hover cursor-pointer"
                    >
                        ← Back to blog list
                    </button>
                    {onNavigateBack && (
                        <>
                            <span className="mx-2">|</span>
                            <button
                                onClick={onNavigateBack}
                                className="terminal-accent hover:terminal-accent-hover cursor-pointer"
                            >
                                Return to home
                            </button>
                        </>
                    )}
                </div>
            </div>
        )
    }

    // Blog post list view
    return (
        <div className="space-y-4">
            <div className="terminal-command terminal-glow">
                <span className="terminal-prompt">$</span> ls blog/
            </div>
            <div className="pl-4 space-y-6">
                {posts.map((post) => (
                    <article key={post.slug} className="border border-gray-600 rounded p-4 hover:border-gray-500 transition-colors">
                        <h3
                            className="terminal-accent font-bold text-lg terminal-glow cursor-pointer hover:terminal-accent-hover"
                            onClick={() => openPost(post)}
                        >
                            📝 {post.title}
                        </h3>
                        <div className="terminal-output text-sm mt-1 mb-2">
                            {post.date} | {post.readTime}
                            {post.tags.length > 0 && (
                                <span className="ml-2 terminal-green">
                                    {post.tags.map(tag => `#${tag}`).join(' ')}
                                </span>
                            )}
                        </div>
                        <p className="terminal-output mt-2 mb-3">
                            {post.excerpt}
                        </p>
                        <div
                            className="terminal-accent text-sm cursor-pointer hover:terminal-accent-hover"
                            onClick={() => openPost(post)}
                        >
                            [Read more →]
                        </div>
                    </article>
                ))}
            </div>

            <div className="terminal-output text-sm mt-6">
                <span className="terminal-accent">Found {posts.length} blog posts</span>
                {onNavigateBack && (
                    <>
                        <span> | </span>
                        <button
                            onClick={onNavigateBack}
                            className="terminal-accent hover:terminal-accent-hover cursor-pointer"
                        >
                            Type 'home' to go back
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
