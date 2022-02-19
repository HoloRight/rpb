const fs = require('fs')

/*
module.exports.generateFontChar = () => {
    const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| |ㅏ-ㅢ-ㅣ|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/
    const minChar = 0xE000
    const maxChar = 0x10FFFD
    let rnd = String.fromCharCode(maxChar + Math.random() * (minChar-maxChar+1))
    if(rnd.match(regex)) {
        console.log(rnd)
        rnd = this.generateFontChar()
    }
    return rnd.charCodeAt(0).toString(16);
}
*/

module.exports.makeid = (length) => {
    var result           = '';
    var characters       = 'abcdef1234567890';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

module.exports.generateFontChar = () => {
    let id = this.makeid(4)

    let regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| |ㅏ-ㅢ-ㅣ|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+$/

    while(this.fromUnicodeString(id).match(regex)) {
        id = this.makeid(4)
    }

    return id
}

module.exports.fromUnicodeString = (unicode) => {
    return String.fromCharCode(parseInt(unicode, 16))
}

module.exports.scanAllFiles = (dir) => {
    const arr = []

    fs.readdirSync(dir).forEach((file) => {
        /*
        if(!file.includes('.png')) {
            this.scanAllFiles(dir + '/' + file).forEach((elem) => {
                arr.push(elem)
            })
        } else {*/
        if(file.includes('.png'))
            arr.push(dir + '/' + file)
        //}
    })

    return arr
}

module.exports.pack = {
    pack: {
        pack_format: 8,
        description: 'Holoright Resource Pack'
    }
}