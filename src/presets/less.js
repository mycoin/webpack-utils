import { cosmiconfigSync } from 'cosmiconfig'
import LessPluginFunctions from 'less-plugin-functions'

export default (documentRoot) => {
  const result = cosmiconfigSync('less').search(documentRoot)
  const mainTsOptions = {
    sourceMap: true,
    lessOptions: {},
  }

  if (result && result.config) {
    mainTsOptions.lessOptions = result.config
  } else {
    mainTsOptions.lessOptions = {
      javascriptEnabled: true,
      plugins: [
        new LessPluginFunctions(),
      ],
    }
  }
  return mainTsOptions
}
