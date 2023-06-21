(async function () {
  const { main } = await System.import('repl/impl')

  /* global Terminal, FitAddon, LocalEchoController */

  var term = new Terminal({
    cursorBlink: 'block'
  })
  term.open(document.getElementById('terminal-container'))
  const fitAddon = new FitAddon.FitAddon()
  term.loadAddon(fitAddon)
  const localEcho = new LocalEchoController()
  term.loadAddon(localEcho)
  fitAddon.fit()

  const replHost = {
    output (text) {
      term.write(text.replace(/([^\r])\n/g, (_, c) => `${c}\r\n`) + '\x1b[37m\r\n')
    },
  
    getInput () {
      return localEcho.read('? ')
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

  window.addEventListener('resize', () => {
    fitAddon.fit()
  })
}())
