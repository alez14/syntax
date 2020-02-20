import {srcData} from './sample.data.js'
import {SymbolContext} from './lib/syntax/symbol-context.js'

const symbolContext = new SymbolContext()
const definedContext = symbolContext.definedContext()
const definedSymbols = symbolContext.definedSymbols()
const textSymbols = symbolContext.textSymbols(srcData)
const undefinedTextSymbols = symbolContext.undefinedTextSymbols(srcData)
const analytics = symbolContext.analytics(srcData)
const symbols = {srcData, definedContext, definedSymbols, textSymbols, undefinedTextSymbols, analytics}

console.log(srcData)
console.log(symbols)
$('body').empty().append(JSON.stringify(symbols, null, 2))

