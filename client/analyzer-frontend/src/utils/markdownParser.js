/**
 * Utility functions for rendering Markdown safely and stripping it for SpeechSynthesis.
 */

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function stripMarkdownForSpeech(text) {
  if (!text) return "";
  return text
    .replace(/```[\s\S]*?```/g, "Code snippet.")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/#+\s+/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|[^\n]+\|/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderMarkdownToHTML(markdown) {
  if (!markdown) return "";

  let html = markdown;

  // Code blocks: ```lang ... ```
  html = html.replace(/```(?:[a-zA-Z0-9_-]+)?\n?([\s\S]*?)```/g, (match, code) => {
    return `<pre class="copilot-code-block"><code>${escapeHTML(code.trim())}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    return `<code class="copilot-inline-code">${escapeHTML(code)}</code>`;
  });

  // Markdown links: [text](url)
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (match, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="copilot-link">${escapeHTML(text)}</a>`;
  });

  // Headers: ### Header, ## Header, # Header
  html = html.replace(/^### (.*$)/gm, '<h4 class="copilot-heading h4">$1</h4>');
  html = html.replace(/^## (.*$)/gm, '<h3 class="copilot-heading h3">$1</h3>');
  html = html.replace(/^# (.*$)/gm, '<h2 class="copilot-heading h2">$1</h2>');

  // Bold & Italic: **bold**, *italic*
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Tables: | col1 | col2 | ...
  html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (tableMatch) => {
    const rows = tableMatch.trim().split('\n').filter(r => r.includes('|'));
    if (rows.length >= 2) {
      let tableHtml = '<div class="copilot-table-wrap"><table class="copilot-table">';
      rows.forEach((row, rowIndex) => {
        // Skip markdown separator row |---|---|
        if (/^\|(?:\s*:?-+:?\s*\|)+$/.test(row.trim())) return;

        const cols = row.split('|').slice(1, -1).map(c => c.trim());
        if (rowIndex === 0) {
          tableHtml += '<thead><tr>' + cols.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>' + cols.map(c => `<td>${c}</td>`).join('') + '</tr>';
        }
      });
      tableHtml += '</tbody></table></div>';
      return tableHtml;
    }
    return tableMatch;
  });

  // Lists: Unordered lists (- or *) and ordered lists (1.)
  const lines = html.split('\n');
  let inUl = false;
  let inOl = false;
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^(\s*)[-*•]\s+(.*)$/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

    if (ulMatch) {
      if (inOl) {
        processedLines.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        processedLines.push('<ul class="copilot-list">');
        inUl = true;
      }
      processedLines.push(`<li>${ulMatch[2]}</li>`);
    } else if (olMatch) {
      if (inUl) {
        processedLines.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        processedLines.push('<ol class="copilot-list-num">');
        inOl = true;
      }
      processedLines.push(`<li>${olMatch[2]}</li>`);
    } else {
      if (inUl) {
        processedLines.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        processedLines.push('</ol>');
        inOl = false;
      }
      processedLines.push(line);
    }
  }

  if (inUl) processedLines.push('</ul>');
  if (inOl) processedLines.push('</ol>');

  html = processedLines.join('\n');

  // Convert single line breaks to <br /> (excluding block elements)
  html = html.replace(/\n(?!\s*<\/?(?:ul|ol|li|pre|code|table|thead|tbody|tr|th|td|h2|h3|h4|div))/g, '<br />');

  return html;
}
