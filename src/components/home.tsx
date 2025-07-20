import { useState, useEffect, useRef } from 'react'
import ProjectsPage from './projects'
import BlogPage from './blog'

interface TerminalLine {
  id: number
  type: 'command' | 'output' | 'error'
  content: string
  timestamp?: Date
}

export default function HomePage() {
  const [currentInput, setCurrentInput] = useState('')
  const [history, setHistory] = useState<TerminalLine[]>([])
  const [currentPage, setCurrentPage] = useState<'home' | 'projects' | 'blog'>('home')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Auto-focus the input and ensure it stays focused
  useEffect(() => {
    const focusInput = () => {
      inputRef.current?.focus()
    }

    focusInput()

    // Re-focus when clicking anywhere on the terminal
    const handleClick = () => {
      setTimeout(focusInput, 0)
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight)
  }, [history])

  // Initialize with welcome message
  useEffect(() => {
    const welcomeLines: TerminalLine[] = [
      { id: 1, type: 'output', content: '┌─ Welcome to Yagiz\'s Terminal ─┐' },
      { id: 2, type: 'output', content: '│ Type \'help\' to see commands    │' },
      { id: 3, type: 'output', content: '└────────────────────────────────┘' },
      { id: 4, type: 'command', content: 'whoami' },
      { id: 5, type: 'output', content: 'Yagiz Kilicarslan - Software Engineer & Backend Lead at ArealAI' },
    ]
    setHistory(welcomeLines)
  }, [])

  const addToHistory = (line: Omit<TerminalLine, 'id'>) => {
    setHistory(prev => [...prev, { ...line, id: Date.now() + Math.random() }])
  }

  const executeCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()

    // Add command to history
    addToHistory({ type: 'command', content: `$ ${command}` })

    // Add to command history
    setCommandHistory(prev => [...prev, command])
    setHistoryIndex(-1)

    switch (cmd) {
      case 'help':
        addToHistory({ type: 'output', content: 'Available commands:' })
        addToHistory({ type: 'output', content: '  whoami     - Display personal information' })
        addToHistory({ type: 'output', content: '  projects   - View my projects' })
        addToHistory({ type: 'output', content: '  blog       - Read my blog posts' })
        addToHistory({ type: 'output', content: '  contact    - Get contact information' })
        addToHistory({ type: 'output', content: '  clear      - Clear terminal' })
        addToHistory({ type: 'output', content: '  home       - Return to home page' })
        break

      case 'whoami':
        addToHistory({ type: 'output', content: 'Yagiz Kilicarslan' })
        addToHistory({ type: 'output', content: 'Software Engineer & Backend Lead at ArealAI' })
        addToHistory({ type: 'output', content: 'Passionate about scalable systems and clean code' })
        break

      case 'contact':
        addToHistory({ type: 'output', content: 'Email: yagiz.kilicarslan1@gmail.com' })
        addToHistory({ type: 'output', content: 'Feel free to reach out for collaborations!' })
        break

      case 'projects':
        addToHistory({ type: 'output', content: 'Loading projects...' })
        setCurrentPage('projects')
        break

      case 'blog':
        addToHistory({ type: 'output', content: 'Loading blog posts...' })
        setCurrentPage('blog')
        break

      case 'home':
        addToHistory({ type: 'output', content: 'Returning to home...' })
        setCurrentPage('home')
        break

      case 'clear':
        setHistory([])
        break

      case 'ls':
        addToHistory({ type: 'output', content: 'home/     projects/     blog/     contact.txt' })
        break

      case 'pwd':
        addToHistory({ type: 'output', content: '/home/yagiz/personal-website' })
        break

      case '':
        // Empty command, just add a new line
        break

      default:
        addToHistory({ type: 'error', content: `Command not found: ${command}. Type 'help' for available commands.` })
        break
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
      setCurrentInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1)
        if (newIndex === commandHistory.length - 1) {
          setHistoryIndex(-1)
          setCurrentInput('')
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    }
  }

  const renderContent = () => {
    if (currentPage === 'projects') {
      return <ProjectsPage />
    }
    if (currentPage === 'blog') {
      return <BlogPage />
    }
    return null
  }

  return (
    <div className="bg-black text-green-400 font-mono p-8 min-h-screen relative">
      <div className="max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-gray-800 rounded-t-lg p-3 flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-400 text-sm ml-4">terminal — yagiz@personal-page</span>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="bg-black border-2 border-gray-800 rounded-b-lg p-6 max-h-[70vh] overflow-y-auto cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Command History */}
          <div className="space-y-1 mb-4">
            {history.map((line) => (
              <div key={line.id} className={`
                ${line.type === 'command' ? 'text-green-300 terminal-glow' : ''}
                ${line.type === 'output' ? 'text-green-400' : ''}
                ${line.type === 'error' ? 'text-red-400' : ''}
              `}>
                {line.content}
              </div>
            ))}
          </div>

          {/* Current Page Content */}
          {currentPage !== 'home' && (
            <div className="mb-4 border-t border-gray-700 pt-4">
              {renderContent()}
            </div>
          )}

          {/* Current Input Line */}
          <div className="flex items-center">
            <span className="text-gray-500 mr-2 select-none">$</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-green-400 outline-none border-none terminal-glow caret-green-400"
                autoComplete="off"
                spellCheck={false}
                style={{ caretColor: '#4ade80' }}
              />
              {!currentInput && (
                <span className="absolute left-0 top-0 text-gray-600 pointer-events-none">
                  Type a command...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
