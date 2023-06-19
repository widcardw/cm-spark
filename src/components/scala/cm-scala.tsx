import { StreamLanguage } from '@codemirror/language'
import { EditorView, basicSetup } from 'codemirror'
import { type Component, createEffect, createSignal, onMount } from 'solid-js'
import { scala } from '@codemirror/legacy-modes/mode/clike'
import { /* Diagnostic, */ linter } from '@codemirror/lint'
import { /* ScalaParseError, parseSource, */ parseStat } from 'scalameta-parsers'
import { judgeAstHasError } from './utils'

const CmScala: Component = () => {
  const [el, setEl] = createSignal<HTMLDivElement>()
  let editor: EditorView | null = null

  createEffect(async () => {
    if (!editor) {
      editor = new EditorView({
        parent: el(),
        extensions: [
          basicSetup,
          StreamLanguage.define(scala),
          linter((view) => {
            // // For list
            // const contentLines = view.state.doc.toString().split('\n').filter(Boolean)
            // const asts = contentLines.map((line) => parseStat(line))
            // const diagnostics: Diagnostic[] = []
            // let last = 0
            // asts.forEach((ast, i) => {
            //   if (judgeAstHasError(ast)) {
            //     const { pos, error: message } = ast
            //     diagnostics.push({ message, from: pos.start + last, to: pos.end + last, severity: 'error' })
            //   }
            //   last += contentLines[i].length + 1
            // })
            // return diagnostics
            // // For single script
            try {
              const content = view.state.doc.toString()
              if (!content)
                return []
              const ast = parseStat(content)
              if (judgeAstHasError(ast)) {
                const { pos, error: message } = ast
                return [{ message, from: pos.start, to: pos.end, severity: 'error' }]
              }
            }
            catch (e) {
              console.error(e)
            }
            return []
          }),
        ],
      })
    }
  })

  return <div ref={r => setEl(r)}></div>
}

export default CmScala
