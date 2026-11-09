import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Explicit input prevents a terminal cwd from selecting another project's text.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv[2]) throw new Error('Informe o caminho de legal-content.js do Core App.');
const source = resolve(process.argv[2]);
const bytes = await readFile(source);
const { LEGAL_DOCUMENTS } = await import(pathToFileURL(source).href);
const sourceHash = createHash('sha256').update(bytes).digest('hex');
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const pages = { terms: 'termos.html', privacy: 'privacidade-sistema.html' };

for (const [key, filename] of Object.entries(pages)) {
  const document = LEGAL_DOCUMENTS[key];
  if (!document?.sections?.length) throw new Error(`Documento ausente: ${key}`);
  const contents = document.sections.map((section) => `        <section id="${escape(section.id)}" aria-labelledby="${escape(section.id)}-heading" tabindex="-1">
          <h2 id="${escape(section.id)}-heading">${escape(section.title)}</h2>
${section.paragraphs.map((text) => `          <p>${escape(text)}</p>`).join('\n')}
${(section.links || []).map((link) => `          <p><a href="${escape(link.href)}">${escape(link.label)}</a></p>`).join('\n')}
        </section>`).join('\n');
  const summary = document.sections.map((section) => `          <li><a href="#${escape(section.id)}">${escape(section.title.replace(/^\d+\.\s*/, ''))}</a></li>`).join('\n');
  await writeFile(resolve(root, filename), `<!doctype html>
<html lang="pt-BR" class="legal-document-page">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#7530df" />
    <title>${escape(document.title)} | Dartalla One</title>
    <meta name="description" content="${escape(document.description)}" />
    <link rel="canonical" href="https://dartalla.com.br/${filename}" />
    <link rel="icon" href="assets/img/favicon.ico" />
    <link rel="stylesheet" href="assets/css/bootstrap.min.css?v=5.3.8.1" />
    <link rel="stylesheet" href="assets/css/main.css?v=20261005.9" />
    <link rel="stylesheet" href="assets/css/legal-documents.css?v=20261109.1" />
  </head>
  <body>
    <!-- Conteúdo do Core App v${escape(document.version)}; SHA-256 ${sourceHash}. Não editar o texto neste arquivo gerado. -->
    <a class="skip-link" href="#main">Pular para o conteúdo</a>
    <header class="legal-header">
      <div class="container">
        <a href="index.html" aria-label="Dartalla One — início"><img src="assets/img/logo/logo.svg" width="172" height="43" alt="Dartalla" /></a>
        <nav aria-label="Documentos legais">
          <a href="termos.html"${key === 'terms' ? ' aria-current="page"' : ''}>Termos de Uso</a>
          <a href="privacidade-sistema.html"${key === 'privacy' ? ' aria-current="page"' : ''}>Política de Privacidade</a>
        </nav>
      </div>
    </header>
    <main id="main" class="container legal-document" tabindex="-1">
      <div id="inicio" class="legal-document-intro">
        <p class="eyebrow">Dartalla One</p>
        <h1>${escape(document.title)}</h1>
        <p>${escape(document.description)}</p>
        <p class="legal-document-version">Versão ${escape(document.version)} · Atualizado em ${escape(document.updatedAt)}</p>
      </div>
      <div class="legal-document-grid">
        <nav class="legal-document-summary" aria-label="Sumário do documento">
          <h2>Neste documento</h2>
          <ol>
${summary}
          </ol>
        </nav>
        <article>
${contents}
          <p><a href="#inicio">Voltar ao início do documento</a></p>
        </article>
      </div>
    </main>
    <footer class="footer gray-bg">
      <div class="container">
        <p>© Dartalla Tecnologia LTDA · CNPJ 54.322.477/0001-12</p>
        <p><a href="index.html">Página inicial</a> · <a href="privacidade.html">Privacidade da página de apresentação</a></p>
      </div>
    </footer>
  </body>
</html>
`);
}
console.log(`Dois documentos sincronizados; fonte SHA-256 ${sourceHash}.`);
