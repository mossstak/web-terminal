import { about } from './about.js'

const clearScreen = {
  description: 'Clear Terminal Screen',
  execute: () => ({ type: 'CLEAR' }),
}

export const commandsMap = new Map([
  ['about', about],
  [
    'portfolio',
    {
      description: 'View the GUI Portfolio of my work.',
      execute: () => {
        window.open('https://mostakkhan.vercel.app/', '_blank')
        return 'Opening GUI Portfolio in a new tab...'
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
  [
    'github',
    {
      description: 'Fetch latest public repositories from GitHub',
      execute: async ([username = 'mossstak']) => {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=3`,
        )
        if (!res.ok)
          throw new Error(`Could not find GitHub user "${username}".`)
        const repos = await res.json()
        if (!repos.length)
          return `No public repositories found for ${username}.`
        return repos
          .map((r) => `• ${r.name}: ${r.description || 'No description'}`)
          .join('\n')
      },
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
          if (seen.has(data)) continue
          seen.add(data)
          if (name === 'help') continue
          helpText += `  ${name.padEnd(10)} - ${data.description}\n`
        }
        return helpText.trimEnd()
      },
    },
  ],
])
