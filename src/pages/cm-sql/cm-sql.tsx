import { createSignal, type Component, createEffect, onCleanup } from 'solid-js'
import { EditorView, basicSetup } from 'codemirror'
// import { EditorState } from '@codemirror/state'
import { linter } from '@codemirror/lint'
import { parse, ParseError } from '@joe-re/sql-parser'
import { sql } from '@codemirror/legacy-modes/mode/sql'
import { StreamLanguage } from '@codemirror/language'

const CmSql: Component = () => {
  const [el, setEl] = createSignal<HTMLDivElement>()

  let editor: EditorView | null = null

  createEffect(() => {
    editor = new EditorView({
      doc: 'select * from people',
      parent: el(),
      extensions: [
        basicSetup,
        StreamLanguage.define(sql({})),
        linter((view) => {
          try {
            const ast = parse(view.state.doc.toString())
            console.log(ast)
            return []
          }
          catch (e) {
            const error = e as ParseError
            const { location, message } = error
            const from = location.start.offset
            const to = location.end.offset
            return [{ from, to, severity: 'error', message }]
          }
        }),
      ]
    })
  })

  onCleanup(() => {
    editor?.destroy()
  })

  return (
    <div ref={r => setEl(r)}></div>
  )
}

export default CmSql