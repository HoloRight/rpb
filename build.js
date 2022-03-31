const fs = require('fs')
const path = require('path')
const utils = require('./utils')

let namespace = 'holoright'

module.exports.buildFontProvider = (pngfile) => {
    const meta = JSON.parse(fs.readFileSync('./gen/' + pngfile + '.json'))
    const id = pngfile.replace('.png', '')
    let chars = []

    let row = meta.row !== undefined ? meta.row : 1
    let column = meta.column !== undefined ? meta.column : 1


    for(let i = 0; i < row; i++) {
        let str = ''
        for(let j = 0; j < column; j++) {
            str += '\\' + 'u' + utils.generateFontChar().toUpperCase()
        }
        chars.push(str)
    }

    return {
        id: id.substring(1, id.length),
        type: 'bitmap',
        file: namespace + ':font' + pngfile,
        ascent: meta.ascent,
        height: meta.height,
        chars: chars
    }
}

module.exports.copyPngFile = (genFile) => {
    if(!fs.existsSync('./res/assets/' + namespace + '/textures/font'))
        fs.mkdirSync('./res/assets/' + namespace + '/textures/font', {
            recursive: true
        })
    
    fs.copyFileSync('./gen/' + genFile, './res/assets/' + namespace + '/textures/font/' + genFile)
}

module.exports.buildAll = () => {

    if(fs.existsSync('./rpb.json'))
        namespace = JSON.parse(fs.readFileSync('./rpb.json')).namespace

    if(fs.existsSync('./res'))
        fs.rmSync('./res', { recursive: true, force: true })
    
    if(!fs.existsSync('./res/assets/minecraft/font'))
        fs.mkdirSync('./res/assets/minecraft/font', {
            recursive: true
        })
    
    if(!fs.existsSync('./res/assets/minecraft/models/item'))
        fs.mkdirSync('./res/assets/minecraft/models/item', {
            recursive: true
        })
    
    if(!fs.existsSync('./res/assets/' + namespace + '/models'))
        fs.mkdirSync('./res/assets/' + namespace + '/models', {
            recursive: true
        })
    
    if(!fs.existsSync('./res/assets/' + namespace + '/textures'))
        fs.mkdirSync('./res/assets/' + namespace + '/textures', {
            recursive: true
        })
    
    if(!fs.existsSync('./res/assets/' + namespace + '/sounds/'))
        fs.mkdirSync('./res/assets/' + namespace + '/sounds/', {
            recursive: true
        })

    const providers = []
    const files = utils.scanAllFiles('./gen')

    files.forEach(file => {
        if(file.endsWith('.png')) {
            console.log('Building font: ' + file)
            this.copyPngFile(file.replace('./gen/', ''))
            providers.push(this.buildFontProvider(file.replace('./gen', '')))
        }
    })

    if(fs.existsSync('./gen_cmd')) {
        fs.readdirSync('./gen_cmd').forEach((itemId) => {
            const overrides = []
            fs.readdirSync('./gen_cmd/' + itemId).forEach((customModelData) => {
                console.log('Copying model: ' + itemId + ' - ' + customModelData.replace('.json', ''))
                overrides.push({
                    predicate: {custom_model_data: parseInt(customModelData.replace('.json', '')), model: '' + namespace + ':' + itemId + '_' + customModelData.replace('.json', '')}
                })
                fs.copyFileSync('./gen_cmd/' + itemId + '/' + customModelData, './res/assets/' + namespace + '/models/' + itemId + '_' + customModelData)
            })
            const vanillaJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'item_models', itemId + '.json')))

            vanillaJson.overrides = overrides

            fs.writeFileSync('./res/assets/minecraft/models/item/' + itemId + '.json', JSON.stringify(vanillaJson))
        })
    }

    if(fs.existsSync('./gen_texture')) {
        fs.readdirSync('./gen_texture').forEach((itemId) => {
            console.log('Copying texture: ' + itemId)
            fs.copyFileSync('./gen_texture/' + itemId, './res/assets/' + namespace + '/textures/' + itemId)
        })
    }

    if(fs.existsSync('./gen_sound')) {

        let metadata = {}

        fs.readdirSync('./gen_sound').forEach((soundFile) => {
            if(soundFile.endsWith('.ogg')) {
                console.log('Copying sound: ' + soundFile)
                fs.copyFileSync('./gen_sound/' + soundFile, './res/assets/' + namespace + '/sounds/' + soundFile)
            } else if(soundFile.endsWith('.ogg.json')) {
                const json = JSON.parse(fs.readFileSync('./gen_sound/' + soundFile))
                metadata[soundFile.replace('.ogg.json', '')] = {category: json.category, sounds: [namespace + ':' + soundFile.replace('.ogg.json', '')]}
            } else {
                console.log('Failed to copy sound ' + soundFile + '! the sound is not .ogg!')
            }
        })

        console.log('Writing sound metadata')

        fs.writeFileSync('./res/assets/' + namespace + '/sounds.json', JSON.stringify(metadata))
    }

    const fontMapping = {}

    providers.forEach((elem) => {
        fontMapping[elem.id] = elem.chars
    })

    fs.writeFileSync('./res/fontmap.json', JSON.stringify(fontMapping).replace(/\\\\/g, '\\'))

    fs.writeFileSync('./res/assets/minecraft/font/default.json', JSON.stringify({
        _comment: 'Auto-generated by HoloRight RPB! Do not edit this file!',
        providers: providers
    }).replace(/\\\\/g, '\\'))

    fs.writeFileSync('./res/pack.mcmeta', JSON.stringify(utils.pack))

}