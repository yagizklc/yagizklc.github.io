export default function BlogPage() {
    return (
        <div className="space-y-4">
            <div className="text-green-300 terminal-glow">
                <span className="text-gray-500">$</span> cat blog/*.md
            </div>
            <div className="pl-4 space-y-6">
                <article className="border border-gray-700 rounded p-4">
                    <h3 className="text-green-400 font-bold text-lg terminal-glow">📝 building-scalable-backends.md</h3>
                    <div className="text-gray-400 text-sm">2024-01-15 | 5 min read</div>
                    <p className="text-gray-300 mt-2">
                        Exploring best practices for building scalable backend systems with microservices architecture.
                        Learn about distributed systems, message queues, and database optimization strategies...
                    </p>
                    <div className="text-blue-400 text-sm mt-2 cursor-pointer hover:text-blue-300">
                        [Read more →]
                    </div>
                </article>

                <article className="border border-gray-700 rounded p-4">
                    <h3 className="text-green-400 font-bold text-lg terminal-glow">⚡ optimizing-database-queries.md</h3>
                    <div className="text-gray-400 text-sm">2024-01-08 | 8 min read</div>
                    <p className="text-gray-300 mt-2">
                        Deep dive into database query optimization techniques, indexing strategies, and performance monitoring.
                        Real-world examples from high-traffic applications...
                    </p>
                    <div className="text-blue-400 text-sm mt-2 cursor-pointer hover:text-blue-300">
                        [Read more →]
                    </div>
                </article>

                <article className="border border-gray-700 rounded p-4">
                    <h3 className="text-green-400 font-bold text-lg terminal-glow">🔒 secure-api-design.md</h3>
                    <div className="text-gray-400 text-sm">2023-12-20 | 6 min read</div>
                    <p className="text-gray-300 mt-2">
                        Essential security practices for API development including authentication, authorization,
                        rate limiting, and input validation...
                    </p>
                    <div className="text-blue-400 text-sm mt-2 cursor-pointer hover:text-blue-300">
                        [Read more →]
                    </div>
                </article>
            </div>

            <div className="text-gray-400 text-sm mt-6">
                <span className="text-green-400">Found 3 blog posts</span> | Type 'home' to go back
            </div>
        </div>
    )
}
