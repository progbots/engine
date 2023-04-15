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
      return new Promise (resolve => {
        const input = document.createElement('input')
        input.setAttribute('type', 'text')
        document.body.appendChild(input)
        input.focus()
        input.addEventListener('keypress', event => {
          if (event.key === 'Enter') {
            resolve(input.value)
            input.setAttribute('readonly', '')
          }
        })
      })
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
