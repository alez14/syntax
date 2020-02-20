export class SymbolContext {
    /* defined-контекст */
    definedContext() {
        return {
            isWord: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0123456789_",
            isSpace: "\x08\x09\x0A\x0D\x20",
            isSign: ".,:;…—?!()<>{}[]\"«»/-+*&%$@=#"
        }
    }
    /* символы defined-контекста */
    definedSymbols(){
        const knownContext = this.definedContext()
        return knownContext.isWord + knownContext.isSpace + knownContext.isSign
    }
    /* символы текста */
    textSymbols(src){
        const textSymbolsMap = new Map()
        for(let index in src){
            textSymbolsMap.set(src.charCodeAt(index), src.charAt(index))
        }
        const textSymbols = Array.from(textSymbolsMap).map(item => item[1]).sort((a, b) => {
            if(a < b) {
                return -1
            } else if(a > b) {
                return 1
            } else {
                return 0
            }
        }).join("")
        return textSymbols
    }
    /* символы текста, неизвестные в defined-контексте */
    undefinedTextSymbols(src){
        return  this.textSymbols(src).split("").filter(symbol => this.definedSymbols().indexOf(symbol) < 0).join("")
    }
    analytics(src) {
        const items = [];
        let transitions = new Map()
        for(let index in src){
            const symbol = src.charAt(index)
            const code = src.charCodeAt(index)
            const prevCode = index > 0 ? src.charCodeAt(1 * index - 1) : -1
            const nextCode = (index < src.length - 1) ? src.charCodeAt(1 * index + 1) : -1
            const knownContext = this.definedContext()
            const isWord = knownContext.isWord.indexOf(symbol) >= 0
            const isSpace = knownContext.isSpace.indexOf(symbol) >= 0
            const isSign = knownContext.isSign.indexOf(symbol) >= 0
            const mask = isWord + isSpace * 2 + isSign * 4
            const context = {isWord, isSpace, isSign}
            const transition = transitions.get(code)
            if(transition != undefined){
                transition.indexes[code].push(index)
                if(transition.next[nextCode] == undefined) {
                    transition.next[nextCode] = [index]
                }else{
                    transition.next[nextCode].push(index)
                }
                if(transition.prev[prevCode] == undefined) {
                    transition.prev[prevCode] = [index]
                }else{
                    transition.prev[prevCode].push(index)
                }
                transition.count++
            }else{
                const indexes = {}
                const next = {}
                const prev = {}
                indexes[code] = [index]
                next[nextCode] = [index]
                prev[prevCode] = [index]
                transitions.set(code, {indexes, prev, next, count: 1, symbol, code})
            }
            items.push({symbol, code, mask, context})
        }
        transitions = Array.from(transitions).map(item => item[1]).sort((a, b) => {
            if(a.count < b.count) {
                return 1
            } else if(a.count > b.count) {
                return -1
            } else {
                if(a.code > b.code) {
                    return 1
                } else if(a.code < b.code) {
                    return -1
                } else {
                    return 0
                }
            }
        })
        return {items, transitions}
    }
}
