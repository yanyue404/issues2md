// table 格式的 html
const table: string = ``;
const logTableHtmlMarkdownStyle = (table: string) =>
  turndownService.turndown(table);
console.log(logTableHtmlMarkdownStyle(table));
