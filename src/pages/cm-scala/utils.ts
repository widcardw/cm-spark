import type { ScalaParseError } from "scalameta-parsers"

function judgeAstHasError(ast: any): ast is ScalaParseError {
    if (Object.hasOwn(ast, 'error'))
        return true
    return false
}

export {
    judgeAstHasError,
}