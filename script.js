import { commandsMap } from './modules/commands.js'

document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('output')
  const input = document.getElementById('cli-input')
  const mirror = document.getElementById('input-mirror')
  const terminalBody = document.getElementById('terminal-body')

  const PROMPT_LABEL = 'guest@terminal:~$'

  // Focus trap
  terminalBody.addEventListener('click', () => input.focus())

  // Input mirror synchronization
  input.addEventListener('input', () => {
    mirror.textContent = input.value
  })

  // Key handling
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const commandText = input.value.trim()

      // 1. Show the command in history
      appendCommand(commandText)

      // 2. Execute the command
      executeCommand(commandText)

      // 3. Clear active line
      input.value = ''
      mirror.textContent = ''
    }
  })

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

  // Appends the entered line to history so it stays visible above the output
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

  // Executes the command
  function executeCommand(inputStr) {
    if (!inputStr) return

    const [cmd, ...args] = inputStr.toLowerCase().split(' ')

    if (commandsMap.has(cmd)) {
      const command = commandsMap.get(cmd)
      const result = command.execute(args, { output })
      if (result) printOutput(result)
    } else {
      printOutput(
        `Command not found: ${cmd}. Type 'help' for commands.`,
        15,
        'error-text',
      )
    }
  }

  // Boot message
  printOutput('Welcome to Web Terminal 1.0.0. Type "help" to start.')
})
