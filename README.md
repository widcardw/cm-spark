# Code Mirror SQL Example

SQL 代码检查算是勉强能用了，在 `sql` 中可以定义一些 schema，这样就有高亮和自动补全了。
然后，sql 的代码检查是通过 `@joe-re/sql-parser` 来执行的，通过 `linter` 插件来实现。

> astro build 失效，可能是编译的时候用的引擎不对？或许需要用 rollup？
> 开发模式下可以运行，可能是因为该页面运行在客户端下。然而，我将 scalameta
> 转移到客户端引入了，依然会发生这样的问题，不知道如何解决。

发现问题了， scalameta 的版本必须是 4.4.17，后面的版本似乎没能解决这个问题。
