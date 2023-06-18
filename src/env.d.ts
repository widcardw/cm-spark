/// <reference types="astro/client" />

declare module 'scalameta-parsers' {
    export function parseSource(code: string): any

    export function parseStat(code: string): any

    interface ScalaParseError {
        error: string
        columnNumber: number
        lineNumber: number
        pos: {
            start: number
            end: number
        }
    }
}
