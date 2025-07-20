export default function ProjectsPage() {
    return (
        <div className="space-y-4">
            <div className="terminal-command terminal-glow">
                <span className="terminal-prompt">$</span> ls projects/
            </div>
            <div className="pl-4 space-y-6">
                <div className="border border-gray-600 rounded p-4">
                    <h3 className="terminal-accent font-bold text-lg terminal-glow">🚀 project-alpha/</h3>
                    <p className="terminal-output mt-2">A full-stack web application built with React and Node.js</p>
                    <div className="terminal-output text-sm mt-2">
                        <span className="terminal-accent">Technologies:</span> React, TypeScript, Node.js, PostgreSQL
                    </div>
                    <div className="terminal-output text-sm">
                        <span className="terminal-accent">Status:</span> In Development
                    </div>
                </div>

                <div className="border border-gray-600 rounded p-4">
                    <h3 className="terminal-accent font-bold text-lg terminal-glow">⚡ automation-suite/</h3>
                    <p className="terminal-output mt-2">Backend automation tools for data processing and analysis</p>
                    <div className="terminal-output text-sm mt-2">
                        <span className="terminal-accent">Technologies:</span> Python, FastAPI, Docker, Redis
                    </div>
                    <div className="terminal-output text-sm">
                        <span className="terminal-accent">Status:</span> Production
                    </div>
                </div>

                <div className="border border-gray-600 rounded p-4">
                    <h3 className="terminal-accent font-bold text-lg terminal-glow">🤖 ai-integration/</h3>
                    <p className="terminal-output mt-2">AI-powered features and integrations for various platforms</p>
                    <div className="terminal-output text-sm mt-2">
                        <span className="terminal-accent">Technologies:</span> Python, TensorFlow, OpenAI API, Kubernetes
                    </div>
                    <div className="terminal-output text-sm">
                        <span className="terminal-accent">Status:</span> Beta
                    </div>
                </div>
            </div>

            <div className="terminal-output text-sm mt-6">
                <span className="terminal-accent">Found 3 projects</span> | Type 'home' to go back
            </div>
        </div>
    )
}
