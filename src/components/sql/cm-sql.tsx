import { type Component, createEffect, createSignal, onCleanup } from 'solid-js'
import { EditorView, basicSetup } from 'codemirror'
import { linter } from '@codemirror/lint'
import type { ParseError } from '@joe-re/sql-parser'
import { parse } from '@joe-re/sql-parser'
import { SQLDialect, sql } from '@codemirror/lang-sql'

// const completions = jsonCompletion.map

const CmSql: Component = () => {
  const [el, setEl] = createSignal<HTMLDivElement>()

  let editor: EditorView | null = null

  createEffect(() => {
    editor = new EditorView({
      parent: el(),
      extensions: [
        basicSetup,
        sql({
          schema: {
            students: ['sid', 'sname', 'age', 'major'],
            courses: ['cid', 'cname'],
          },
          upperCaseKeywords: true,
          dialect: SQLDialect.define({
            keywords: 'add after all alter analyze and anti archive array as asc at between bucket buckets by cache cascade case cast change clear cluster clustered codegen collection column columns comment commit compact compactions compute concatenate cost create cross cube current current_date current_timestamp database databases data dbproperties defined delete delimited deny desc describe dfs directories distinct distribute drop else end escaped except exchange exists explain export extended external false fields fileformat first following for format formatted from full function functions global grant group grouping having if ignore import in index indexes inner inpath inputformat insert intersect interval into is items join keys last lateral lazy left like limit lines list load local location lock locks logical macro map minus msck natural no not null nulls of on optimize option options or order out outer outputformat over overwrite partition partitioned partitions percent preceding principals purge range recordreader recordwriter recover reduce refresh regexp rename repair replace reset restrict revoke right rlike role roles rollback rollup row rows schema schemas select semi separated serde serdeproperties set sets show skewed sort sorted start statistics stored stratify struct table tables tablesample tblproperties temp temporary terminated then to touch transaction transactions transform true truncate unarchive unbounded uncache union unlock unset use using values view when where window with',
            types: 'tinyint smallint int bigint boolean float double string binary timestamp decimal array map struct uniontype delimited serde sequencefile textfile rcfile inputformat outputformat',
            builtin: 'any any_value approx_count_distinct approx_percentile array_agg avg bit_and bit_or bit_xor bool_and bool_or collect_list collect_set count count_if count_min_sketch covar_pop covar_samp every first first_value grouping grouping_id history_numeric kurtosis last last_value max max_by mean median min min_by mode percentile percentile_approx regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy skewness some std stddev stddev_pop stddev_samp sum try_avg try_sum var_pop var_samp variance',
          }),
        }),
        linter((view) => {
          try {
            const ast = parse(view.state.doc.toString())
            // console.log(ast)
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
      ],
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
