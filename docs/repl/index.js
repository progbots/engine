(async function () {
  const { main } = await System.import('repl/impl')
  const { blue, cyan, green, magenta, red, white, yellow } = await System.import('repl/colors')

  const replHost = {
    output (text) {
      const line = document.createElement('div')
      text.split('\u270e').forEach((part, index) => {
        if (index === 0) {
          if (part) {
            line.appendChild(document.createTextNode(part))
          }
          return
        }
        const [, color, colored] = part.match(/^(red|green|yellow|blue|magenta|cyan|white)(.*)/)
        if (colored) {
          const span = document.createElement('span')
          span.className = color
          span.appendChild(document.createTextNode(colored))
          line.appendChild(span)
        }
      })
      document.body.appendChild(line)
    },
  
    async getInput () {
      return prompt('?')
    },
  
    async getChar (options) {
    },
  
    getSample (name) {
      return ''
    }
  }
  
  window.addEventListener('load', async () => {
    await main(replHost, location.search.includes('debug'))
  })
}())
