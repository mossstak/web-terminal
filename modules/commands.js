const clearScreen = {
  description: 'Clear Terminal Screen',
  execute: (args, { output }) => {
    output.innerHTML = ''
    return null
  },
}

export const commandsMap = new Map([
  [
    'about',
    {
      description: "Describing the User's Background",
      execute: () =>
        'I am a web developer building interactive web applications.',
    },
  ],
  [
    'portfolio',
    {
      description: 'View the GUI Portfolio of my work.',
      execute: () => {
        window.open('https://mostakkhan.vercel.app/', '_blank');
        return 'Open GUI Portfolio in a new tab...';
      },
    },
  ],
  [
    'project',
    {
      description: 'View small projects from my Github',
      execute: () => '1. Web Terminal\n2. Portfolio Website\n3. Weather CLI',
    },
  ],
  ['clear', clearScreen],
  ['cls', clearScreen],
  [
    'help',
    {
      description: 'List available commands',
      execute: () => {
        let helpText = 'Available commands:\n'
        const seen = new Set()
        for (const [name, data] of commandsMap.entries()) {
          if (seen.has(data)) continue // Skips aliases that share the same object
          seen.add(data)
          if (name == 'help') continue;
          helpText += `  ${name.padEnd(10)} - ${data.description}\n`
        }
        return helpText.trimEnd()
      },
    },
  ],
])
