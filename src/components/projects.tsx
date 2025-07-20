export default function ProjectsPage() {
    return (
        <div className="space-y-4">
            <div className="text-green-300 terminal-glow">
                <span className="text-gray-500">$</span> ls projects/
            </div>
            <div className="pl-4 space-y-6">
                <div className="border border-gray-700 rounded p-4">
                    <h3 className="text-green-400 font-bold text-lg terminal-glow">🚀 project-alpha/</h3>
                    <p className="text-gray-300 mt-2">A full-stack web application built with React and Node.js</p>
                    <div className="text-gray-400 text-sm mt-2">
                        <span className="text-blue-400">Technologies:</span> React, TypeScript, Node.js, PostgreSQL
                    </div>
                    <div className="text-gray-400 text-sm">
                        <span className="text-blue-400">Status:</span> In Development
                    </div>
                </div>

                <div className="border border-gray-700 rounded p-4">
                    <h3 className="text-green-400 font-bold text-lg terminal-glow">⚡ automation-suite/</h3>
                    <p className="text-gray-300 mt-2">Backend automation tools for data processing and analysis</p>
                    <div className="text-gray-400 text-sm mt-2">
                        <span className="text-blue-400">Technologies:</span> Python, FastAPI, Docker, Redis
                    </div>
                    <div className="text-gray-400 text-sm">
                        <span className="text-blue-400">Status:</span> Production
                    </div>
                </div>

                <div className="border border-gray-700 rounded p-4">
                    <h3 className="text-green-400 font-bold text-lg terminal-glow">🤖 ai-integration/</h3>
                    <p className="text-gray-300 mt-2">AI-powered features and integrations for various platforms</p>
                    <div className="text-gray-400 text-sm mt-2">
                        <span className="text-blue-400">Technologies:</span> Python, TensorFlow, OpenAI API, Kubernetes
                    </div>
                    <div className="text-gray-400 text-sm">
                        <span className="text-blue-400">Status:</span> Beta
                    </div>
                </div>
            </div>

            <div className="text-gray-400 text-sm mt-6">
                <span className="text-green-400">Found 3 projects</span> | Type 'home' to go back
            </div>
        </div>
    )
}
