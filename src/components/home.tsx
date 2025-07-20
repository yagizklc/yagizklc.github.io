import { useState, useEffect, useRef } from 'react'
import ProjectsPage from './projects'
import BlogPage from './blog'

interface TerminalLine {
  id: number
  type: 'command' | 'output' | 'error' | 'accent' | 'help'
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

  // Valid commands for syntax highlighting
  const validCommands = ['help', 'whoami', 'contact', 'projects', 'blog', 'home', 'clear', 'ls', 'pwd']

  // Check if current input is a valid command
  const isValidCommand = (input: string) => {
    return validCommands.includes(input.toLowerCase().trim())
  }

  // Get matching commands for auto-completion
  const getMatchingCommands = (input: string) => {
    if (!input) return []
    return validCommands.filter(cmd =>
      cmd.toLowerCase().startsWith(input.toLowerCase().trim())
    )
  }

  // Check if input has partial matches
  const hasPartialMatch = (input: string) => {
    return getMatchingCommands(input).length > 0
  }

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
      { id: 1, type: 'output', content: 'Welcome to my terminal portfolio. (Version 1.0.0)' },
      { id: 2, type: 'output', content: '----' },
      { id: 3, type: 'output', content: '' },
      { id: 4, type: 'output', content: 'This project\'s source code can be seen in this project\'s ' },
      { id: 5, type: 'accent', content: 'GitHub repo: https://github.com/yagizklc/yagizklc.github.io' },
      { id: 6, type: 'output', content: '' },
      { id: 7, type: 'output', content: '----' },
      { id: 8, type: 'output', content: '' },
      { id: 9, type: 'output', content: 'For a list of available commands, type \'help\'.' },
    ]
    setHistory(welcomeLines)
  }, [])

  const addToHistory = (line: Omit<TerminalLine, 'id'>) => {
    setHistory(prev => [...prev, { ...line, id: Date.now() + Math.random() }])
  }

  const executeCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()

    // Add command to history
    addToHistory({ type: 'command', content: `visitor@yagiz-terminal:~$ ${command}` })

    // Add to command history
    setCommandHistory(prev => [...prev, command])
    setHistoryIndex(-1)

    switch (cmd) {
      case 'help':
        addToHistory({ type: 'output', content: 'Available commands:' })
        addToHistory({ type: 'help', content: '  whoami     - Display personal information' })
        addToHistory({ type: 'help', content: '  projects   - View my projects' })
        addToHistory({ type: 'help', content: '  blog       - Read my blog posts' })
        addToHistory({ type: 'help', content: '  contact    - Get contact information' })
        addToHistory({ type: 'help', content: '  clear      - Clear terminal' })
        addToHistory({ type: 'help', content: '  home       - Return to home page' })
        break

      case 'whoami':
        addToHistory({ type: 'output', content: 'Yagiz Kilicarslan' })
        addToHistory({ type: 'output', content: 'Software Engineer & Backend Lead at ArealAI' })
        addToHistory({ type: 'output', content: 'Passionate about scalable systems and clean code' })
        break

      case 'contact':
        addToHistory({ type: 'output', content: 'Contact Information:' })
        addToHistory({ type: 'accent', content: '📧  yagiz.kilicarslan1@gmail.com' })
        addToHistory({ type: 'output', content: '' })
        addToHistory({ type: 'output', content: 'Find me online:' })
        addToHistory({ type: 'accent', content: '🐙  https://github.com/yagizklc' })
        addToHistory({ type: 'accent', content: '💼  https://linkedin.com/in/yagizkilicarslan' })
        addToHistory({ type: 'accent', content: '🐦  https://twitter.com/yagizklc' })
        addToHistory({ type: 'output', content: '' })
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
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = getMatchingCommands(currentInput)
      if (matches.length === 1) {
        setCurrentInput(matches[0])
      } else if (matches.length > 1) {
        // Show available completions
        addToHistory({ type: 'output', content: `Possible completions: ${matches.join(', ')}` })
      }
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
      return <BlogPage onNavigateBack={() => setCurrentPage('home')} />
    }
    return null
  }

  return (
    <div className="bg-gray-900 text-gray-300 p-8 min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-gray-800 rounded-t-lg p-4 flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-gray-400 text-base ml-4">terminal — yagiz@personal-page</span>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="bg-gray-900 border-2 border-gray-700 rounded-b-lg p-10 min-h-[80vh] max-h-[85vh] overflow-y-auto cursor-text terminal-text"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Command History */}
          <div className="space-y-2 mb-6">
            {history.map((line) => {
              const renderContent = (content: string, lineType: string) => {
                // Special handling for help commands
                if (lineType === 'help') {
                  const match = content.match(/^(\s*)(\w+)(\s*-\s*.*)$/)
                  if (match) {
                    const [, indent, command, description] = match
                    return (
                      <>
                        <span>{indent}</span>
                        <span className="terminal-green">{command}</span>
                        <span>{description}</span>
                      </>
                    )
                  }
                }

                // Check if content contains URLs
                const urlRegex = /(https?:\/\/[^\s]+)/g
                const parts = content.split(urlRegex)

                return (
                  <>
                    {parts.map((part, index) => {
                      if (urlRegex.test(part)) {
                        return (
                          <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="terminal-accent hover:terminal-accent-hover underline transition-colors"
                          >
                            {part}
                          </a>
                        )
                      }
                      return <span key={index}>{part}</span>
                    })}
                  </>
                )
              }

              return (
                <div key={line.id} className={`
                  ${line.type === 'command' ? 'terminal-command terminal-glow' : ''}
                  ${line.type === 'output' ? 'terminal-output' : ''}
                  ${line.type === 'error' ? 'terminal-error' : ''}
                  ${line.type === 'accent' ? 'terminal-accent' : ''}
                  ${line.type === 'help' ? 'terminal-help' : ''}
                `}>
                  {renderContent(line.content, line.type)}
                </div>
              )
            })}
          </div>

          {/* Current Page Content */}
          {currentPage !== 'home' && (
            <div className="mb-4 border-t border-gray-700 pt-4">
              {renderContent()}
            </div>
          )}

          {/* Current Input Line */}
          <div className="flex items-center">
            <span className="terminal-prompt mr-3 select-none text-lg">visitor@yagiz-terminal:~$</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full bg-transparent outline-none border-none terminal-glow text-lg ${!currentInput
                  ? 'text-gray-300'
                  : isValidCommand(currentInput)
                    ? 'terminal-green'
                    : hasPartialMatch(currentInput)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                autoComplete="off"
                spellCheck={false}
                style={{ caretColor: '#ffa500' }}
              />
              {!currentInput && (
                <span className="absolute left-0 top-0 text-gray-600 pointer-events-none text-lg">
                  Type a command...
                </span>
              )}
              {/* Auto-completion hint */}
              {currentInput && hasPartialMatch(currentInput) && !isValidCommand(currentInput) && (
                <div className="absolute left-0 top-8 text-sm text-gray-500">
                  Press Tab to auto-complete
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
