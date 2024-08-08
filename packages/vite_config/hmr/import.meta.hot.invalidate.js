export let ll = 111

if (import.meta.hot) {
  import.meta.hot.accept((moduleId) => {
    console.log('测试dispose////', moduleId.ll)
    if (moduleId.ll > 10) {
      import.meta.hot.invalidate()
    }
  })
}
