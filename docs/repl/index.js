window.addEventListener('load', async () => {
  const { main } = await System.import('repl/impl')

  /* global Terminal, FitAddon, LocalEchoController */

  var term = new Terminal({
    cursorBlink: 'block'
  })
  term.open(document.getElementById('xterm-container'))
  const fitAddon = new FitAddon.FitAddon()
  term.loadAddon(fitAddon)
  const localEcho = new LocalEchoController()
  term.loadAddon(localEcho)
  fitAddon.fit()

  const replHost = {
    output (text) {
      term.write(text.replace(/\n/g, '\r\n') + '\x1b[37m\r\n')
    },
  
    getInput () {
      return localEcho.read('? ')
    },
  
    getChar () {
      return new Promise(resolve => {
        const disposable = term.onKey(event => {
          resolve(event.key)
          disposable.dispose()
        })
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
  
  window.addEventListener('resize', () => {
    fitAddon.fit()
  })

  await main(replHost, location.search.includes('debug'))
})
