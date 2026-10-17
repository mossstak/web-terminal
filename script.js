import { commandsMap } from './modules/commands.js'

document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('output')
  const input = document.getElementById('cli-input')
  const mirror = document.getElementById('input-mirror')
  const terminalBody = document.getElementById('terminal-body')

  const PROMPT_LABEL = 'guest@terminal:~$'

  // History buffer and pointer
  const history = []
  let historyIndex = -1

  // Focus trap
  terminalBody.addEventListener('click', () => input.focus())

  // Input mirror synchronization
  input.addEventListener('input', () => {
    mirror.textContent = input.value
  })

  // Keyboard navigation & execution
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const commandText = input.value.trim()

      if (commandText) {
        history.push(commandText)
        historyIndex = history.length
      }

      // 1. Show command in history
      appendCommand(commandText)

      // 2. Clear active line immediately
      input.value = ''
      mirror.textContent = ''

      // 3. Execute the command (supports async)
      await executeCommand(commandText)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--
        setInputValue(history[historyIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        historyIndex++
        setInputValue(history[historyIndex])
      } else {
        historyIndex = history.length
        setInputValue('')
      }
    }
  })

  // Helper to keep the native input and mirrored text in sync
  function setInputValue(value) {
    input.value = value
    mirror.textContent = value
    // Keep cursor at end of line
    input.setSelectionRange(value.length, value.length)
  }

  // Typewriter output function
  function printOutput(text, speed = 15, className = 'response') {
    const line = document.createElement('div')
    line.className = className
    output.appendChild(line)

    let index = 0
    const interval = setInterval(() => {
      line.textContent += text[index]
      index++
      terminalBody.scrollTop = terminalBody.scrollHeight
      if (index >= text.length) {
        clearInterval(interval)
      }
    }, speed)
  }

  // Appends entered line to history
  function appendCommand(cmdText) {
    const line = document.createElement('div')
    line.className = 'history-line'
    line.innerHTML = `<span class="prompt">${PROMPT_LABEL}</span> <span>${escapeHtml(cmdText)}</span>`
    output.appendChild(line)
    terminalBody.scrollTop = terminalBody.scrollHeight
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  // Executes command with async support and decoupled UI actions
  async function executeCommand(inputStr) {
    if (!inputStr) return

    const [cmd, ...args] = inputStr.toLowerCase().split(' ')

    if (commandsMap.has(cmd)) {
      const command = commandsMap.get(cmd)
      try {
        const result = await command.execute(args)

        // Handle decoupled actions like clearing the terminal
        if (result?.type === 'CLEAR') {
          output.innerHTML = ''
        } else if (typeof result === 'string') {
          printOutput(result)
        }
      } catch (err) {
        printOutput(`Error: ${err.message}`, 15, 'error-text')
      }
    } else {
      printOutput(
        `Command not found: ${cmd}. Type 'help' for commands.`,
        15,
        'error-text',
      )
    }
  }

  function navigateHistory(direction) {
    if (direction === 'up') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--
        setInputValue(history[historyIndex])
      }
    } else if (direction === 'down') {
      if (historyIndex < history.length - 1) {
        historyIndex++
        setInputValue(history[historyIndex])
      } else {
        historyIndex = history.length
        setInputValue('')
      }
    }
  }

  // Touch toolbar events
  document.getElementById('btn-history-up')?.addEventListener('click', (e) => {
    e.preventDefault()
    navigateHistory('up')
    input.focus()
  })

  document
    .getElementById('btn-history-down')
    ?.addEventListener('click', (e) => {
      e.preventDefault()
      navigateHistory('down')
      input.focus()
    })

  // Boot message
  printOutput('Welcome to Web Terminal 1.0.0. Type "help" to start.')
})
