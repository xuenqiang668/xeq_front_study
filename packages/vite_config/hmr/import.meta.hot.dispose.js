export let ll = 0

let info = {
  count: 0,
}

if (import.meta.hot) {
  import.meta.hot.accept()
}

let timer = setInterval(() => {
  info.count++
  console.log('info:', info.count)
}, 1000)

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // clear effect here
    clearInterval(timer)
  })
}

info = import.meta.hot.data.info = {
  count: import.meta.hot.data.info ? import.meta.hot.data.info.count : 0,
}
