import viteBaseConfig from '../vite.base.config'
import viteDevConfig from '../vite.dev.config'
import viteProdConfig from '../vite.prod.config'
import { merge } from 'lodash-es'

export const envResolve = {
  build: () => {
    console.log('prod')
    return merge(viteBaseConfig, viteProdConfig)
  },
  serve: () => {
    console.log('dev')
    return merge(viteBaseConfig, viteDevConfig)
  },
}
