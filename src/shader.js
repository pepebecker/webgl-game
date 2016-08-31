module.exports = (data) => {
  const vertex = data.split('[vertex]\n')[1].split('\n[fragment]')[0]
  const fragment = data.split('[fragment]\n')[1]
  return { vertex, fragment }
}
