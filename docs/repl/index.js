(async function () {
  const { main } = await System.import('repl/impl')

  /* global Terminal, LocalEchoController */

  var term = new Terminal({
    cursorBlink: 'block'
  })
  term.open(document.getElementById('terminal'))
  const localEcho = new LocalEchoController()
  term.loadAddon(localEcho)

  const replHost = {
    output (text) {
      term.write(text + '\r\n')
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
}())
