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
      document.body.appendChild(line).scrollIntoView()
    },
  
    getInput () {
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
  
    getChar () {
      return new Promise(resolve => {
        window.addEventListener('keypress', event => {
          resolve(event.key)
        }, { once: true })
      })
    },
  
    async getSample (name) {
      const response = await fetch(`../samples/${name}`)
      if (response.status !== 200) {
        throw new Error('Sample not found')
      }
      return await response.text()
    }
  }
  
  window.addEventListener('load', async () => {
    await main(replHost, location.search.includes('debug'))
  })
}())
