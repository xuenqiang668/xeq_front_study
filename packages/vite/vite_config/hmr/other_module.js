import './self_module'

if (import.meta.hot) {
  import.meta.hot.accept('./self_module.js', (moduleId) => {
    console.log('other_module.js is updated', moduleId)
  })
}
