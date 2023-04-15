import { readFile, writeFile } from 'node:fs/promises'

async function main (path: string) {
  const utf8content = (await readFile(path)).toString()
  const ansiiContent = utf8content.replace(/[^\r\n\t -~]/g, (match: string) => {
    const ascii = `\\u${match.charCodeAt(0).toString(16).padStart(4, '0')}`
    // console.log(match, match.length, ascii)
    return ascii
  })
  await writeFile(path, ansiiContent)
}

main(process.argv[2])