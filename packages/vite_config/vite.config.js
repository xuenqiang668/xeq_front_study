import { defineConfig, loadEnv } from 'vite'
import { envResolve } from './src/utils/envResolve'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // console.log(env)
  return envResolve[command]()
})
