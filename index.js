const args = process.argv
const utils = require('./utils')
const build = require('./build')
const a = args[args.length - 1]

function showHelp() {
    console.log('resourcepackbuilder\n\n' + 'rpb b[uild] - build all files to font resource pack')
}

if(a === 'build') {
    build.buildAll()
} else if(a === 'randomchar') {
    const c = utils.generateFontChar()
    console.log('the random char: ' + utils.fromUnicodeString(c) + ' - ' + c)
} else if(a === 'scanfiles') {
    console.log(utils.scanAllFiles('./gen'))
} else {
    showHelp()
}