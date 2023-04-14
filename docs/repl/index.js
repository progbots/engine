(async function () {
  const { createState } = await System.import('factory')
  console.log(createState)
}())
