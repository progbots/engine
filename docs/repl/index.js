(async function () {
  const { main } = await System.import('repl/impl')
  const { blue, cyan, green, magenta, red, white, yellow } = await System.import('repl/colors')

  const replHost = {
    output (text) {
      const line = document.createElement('div')
      line.innerHtml = text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&agt;')
      // console.log(text
      //   .replaceAll(red, '\x1b[31m')
      //   .replaceAll(green, '\x1b[32m')
      //   .replaceAll(yellow, '\x1b[33m')
      //   .replaceAll(blue, '\x1b[34m')
      //   .replaceAll(magenta, '\x1b[35m')
      //   .replaceAll(cyan, '\x1b[36m')
      //   .replaceAll(white, '\x1b[37m')
      // )
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
