import { StreamLanguage } from '@codemirror/language'
import { EditorView, basicSetup } from 'codemirror'
import { type Component, createEffect, createSignal, onMount } from 'solid-js'
import { scala } from '@codemirror/legacy-modes/mode/clike'
import { /* Diagnostic, */ linter } from '@codemirror/lint'
import { /* ScalaParseError, parseSource, */ parseStat } from 'scalameta-parsers'
import type { Completion, CompletionInfo } from '@codemirror/autocomplete'
import { CompletionContext, autocompletion, completeFromList } from '@codemirror/autocomplete'
import type { EditorState } from '@codemirror/state'
import { judgeAstHasError } from './utils'

import * as jsonCompletion from './codemirror-spark-functions.json'

import './cm-scala.css'

function isCursorInString(state: EditorState) {
  const cursor = state.selection.main.head
  const line = state.doc.lineAt(cursor).text
  const reg = /(['"])[^'"]*\1/g
  const m = line.matchAll(reg)
  let match: IteratorResult<RegExpMatchArray, RegExpMatchArray> = m.next()
  while (!match.done) {
    const word = match.value[0]
    const start = match.value.index!
    const end = start + word.length
    if (cursor >= start && cursor < end)
      return true
    match = m.next()
  }
  return false
}

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
          autocompletion({
            override: [completeFromList(((jsonCompletion as any).default as Completion[]).map((i) => {
              const info = () => {
                const dom = document.createElement('div')
                if (typeof i.info === 'string')
                  dom.innerHTML = i.info
                return dom
              }
              const snippet = (i.apply || '') as string
              const apply = (view: EditorView, completion: Completion, from: number, to: number) => {
                const cursor = view.state.selection.main.head
                // const line = view.state.doc.lineAt(cursor).text
                const m = snippet.match(/\$\{\"(.*?)\"\}/)
                let offset = 0
                let head = 0
                if (m && typeof m.index === 'number') {
                  offset = m.index
                  head = m[0].length
                }

                // console.log('matched', offset, head)

                view.dispatch({
                  changes: {
                    from,
                    to,
                    insert: snippet,
                  },
                  selection: {
                    anchor: from + offset,
                    head: from + offset + head,
                  },
                })
              }
              return {
                apply,
                label: i.label,
                type: i.type,
                detail: i.detail,
                info,
                boost: i.boost,
                section: i.section,
              }
            }))],
            closeOnBlur: false,
          }),
        ],
      })
      // editor.contentDOM.addEventListener('keydown', () => {
      //   const menu = editor!.dom.querySelector('.cm-tooltip-autocomplete')
      //   if (menu && isCursorInString(editor!.state)) {
      //     // console.log('in string')
      //     // menu.remove()
      //   }
      // })
    }
  })

  return <div ref={r => setEl(r)}></div>
}

export default CmScala
