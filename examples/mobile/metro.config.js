// Runs the app against the Rupa sources in this repo, so edits in packages/react-native
// reload instantly. A real app just installs @rupa-ui/react-native from npm.
const path = require('node:path')
const { getDefaultConfig } = require('expo/metro-config')

const repo = path.resolve(__dirname, '../..')
const source = path.join(repo, 'packages/react-native/src')
const tokens = path.join(repo, 'packages/tokens/dist/react-native/index.js')

const config = getDefaultConfig(__dirname)

config.watchFolders = [source, path.dirname(tokens)]
// Packages imported by the Rupa sources resolve from this app, so there is one copy of react
// and react-native (the repo root has its own for tests).
const fromApp = path.join(__dirname, 'index.ts')
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@rupa-ui/react-native') {
    return { type: 'sourceFile', filePath: path.join(source, 'index.ts') }
  }
  if (moduleName === '@rupa-ui/tokens/react-native') {
    return { type: 'sourceFile', filePath: tokens }
  }
  if (context.originModulePath.startsWith(source)) {
    // The sources use ESM specifiers (`./Button.js`) for files that are really .tsx.
    if (/^\..*\.js$/.test(moduleName)) {
      return context.resolveRequest(context, moduleName.slice(0, -3), platform)
    }
    if (!moduleName.startsWith('.')) {
      return context.resolveRequest({ ...context, originModulePath: fromApp }, moduleName, platform)
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
