const editor = document.getElementById('editor');
const lineNumbers = document.getElementById('lineNumbers');
const infoDialog = document.getElementById('infoDialog');
const closeDialog = document.getElementById('closeDialog');
const settingsDialog = document.getElementById('settingsDialog');
const closeSettingsDialog = document.getElementById('closeSettingsDialog');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');
const wordCount = document.getElementById('wordCount');
const sizeCount = document.getElementById('sizeCount');
const fontSelect = document.getElementById('fontSelect');
const themeSelect = document.getElementById('themeSelect');
const languageSelect = document.getElementById('languageSelect');
const expirationSelect = document.getElementById('expirationSelect');
const saveButton = document.getElementById('save');
const rawButton = document.getElementById('raw-button');
const highlightLangMeta = document.querySelector('meta[name="highlight-language"]');
const languageDisplay = document.getElementById('languageDisplay');

const isEditMode = editor.tagName === 'TEXTAREA';

const DEFAULT_LANGUAGE = 'auto';

const expirationOptions = [
  // { value: 'never', label: 'Never' },
  { value: '1d', label: '1 Day' },
  { value: '3d', label: '3 Days' },
  { value: '7d', label: '7 Days' },
  { value: '14d', label: '14 Days' },
  { value: '30d', label: '30 Days' }
];

const languages = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'apache', label: 'Apache' },
  { value: 'bash', label: 'Bash' },
  { value: 'c', label: 'C' },
  { value: 'cmake', label: 'CMake' },
  { value: 'clojure', label: 'Clojure' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'css', label: 'CSS' },
  { value: 'diff', label: 'Diff' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'dos', label: 'Batch' },
  { value: 'elixir', label: 'Elixir' },
  { value: 'erlang', label: 'Erlang' },
  { value: 'fsharp', label: 'F#' },
  { value: 'go', label: 'Go' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'groovy', label: 'Groovy' },
  { value: 'haskell', label: 'Haskell' },
  { value: 'html', label: 'HTML' },
  { value: 'ini', label: 'INI' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'json', label: 'JSON' },
  { value: 'jsx', label: 'React JSX' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'latex', label: 'LaTeX' },
  { value: 'less', label: 'Less' },
  { value: 'lua', label: 'Lua' },
  { value: 'makefile', label: 'Makefile' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'nginx', label: 'Nginx' },
  { value: 'objectivec', label: 'Objective-C' },
  { value: 'ocaml', label: 'OCaml' },
  { value: 'perl', label: 'Perl' },
  { value: 'pgsql', label: 'PostgreSQL' },
  { value: 'php', label: 'PHP' },
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'properties', label: 'Properties' },
  { value: 'protobuf', label: 'Protocol Buffers' },
  { value: 'python', label: 'Python' },
  { value: 'r', label: 'R' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
  { value: 'sass', label: 'Sass' },
  { value: 'scala', label: 'Scala' },
  { value: 'scss', label: 'SCSS' },
  { value: 'shell', label: 'Shell' },
  { value: 'sql', label: 'SQL' },
  { value: 'swift', label: 'Swift' },
  { value: 'toml', label: 'TOML' },
  { value: 'tsx', label: 'React TSX' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'vbnet', label: 'VB.NET' },
  { value: 'vim', label: 'Vim Script' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'zig', label: 'Zig' },
  { value: 'zsh', label: 'Zsh' }
];

function populateLanguageSelect() {
  if (!languageSelect) return;
  languageSelect.innerHTML = '';
  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.value;
    option.textContent = lang.label;
    languageSelect.appendChild(option);
  });
}

function populateExpirationSelect() {
  if (!expirationSelect) return;
  expirationSelect.innerHTML = '';
  expirationOptions.forEach(exp => {
    const option = document.createElement('option');
    option.value = exp.value;
    option.textContent = exp.label;
    expirationSelect.appendChild(option);
  });
}

function setupLanguageDisplay() {
  if (!languageDisplay) return;
  const lang = highlightLangMeta?.getAttribute('content');
  languageDisplay.innerHTML = lang ? languages.find(l => l.value === lang)?.label : "Unknown";
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeIcon.src = theme === 'dark' ? '/img/icons/moon.svg' : '/img/icons/sun.svg';
}

function getTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setFont(font) {
  editor.style.fontFamily = font;
  lineNumbers.style.fontFamily = font;
  localStorage.setItem('font', font);
  fontSelect.value = font;
}

function getFont() {
  const savedFont = localStorage.getItem('font');
  if (savedFont) return savedFont;
  return "'Courier New', monospace";
}

function setSyntaxTheme(theme) {
  const existingLink = document.getElementById('highlight-theme');
  if (existingLink) {
    existingLink.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/${theme}.min.css`;
  }
  localStorage.setItem('syntaxTheme', theme);
  if (themeSelect) themeSelect.value = theme;
}

function getSyntaxTheme() {
  const savedTheme = localStorage.getItem('syntaxTheme');
  if (savedTheme) return savedTheme;
  return 'default';
}

setTheme(getTheme());
setFont(getFont());
setSyntaxTheme(getSyntaxTheme());

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

function getEditorContent() {
  return isEditMode ? editor.value : editor.textContent;
}

function updateLineNumbers() {
  const text = getEditorContent();
  const lines = text.split('\n');
  lineNumbers.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function updateStats() {
  const text = getEditorContent();
  charCount.textContent = text.length;

  const lines = text.split('\n');
  lineCount.textContent = text.length === 0 ? 0 : lines.length;

  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  wordCount.textContent = words.length;

  const bytes = new Blob([text]).size;
  sizeCount.textContent = formatBytes(bytes);
}

function updateSaveButtonState() {
  const content = getEditorContent();
  const hasContent = content && content.trim().length > 0;
  if (saveButton) {
    saveButton.style.opacity = hasContent ? '1' : '0.5';
    saveButton.style.pointerEvents = hasContent ? 'auto' : 'none';
  }
}

async function saveFile() {
  let content = getEditorContent();
  let language = document.getElementById('languageSelect').value;
  let expiration = document.getElementById('expirationSelect').value;

  if (!content || content.trim().length === 0) {
    return;
  }

  if (language === DEFAULT_LANGUAGE) {
    language = hljs.highlightAuto(content).language;
  }

  const response = await fetch("/", {
    method: "POST",
    body: JSON.stringify({ content, language, expiration }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    window.location.href = `/${data.id}`;
  }
}

if (isEditMode) {
  editor.addEventListener('input', () => {
    updateLineNumbers();
    updateStats();
    updateSaveButtonState();
  });
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;

      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;

      updateLineNumbers();
      updateStats();
      updateSaveButtonState();
    }
  });
  editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
  });
  updateLineNumbers();
  updateStats();
  updateSaveButtonState();
} else {
  editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
  });
  updateLineNumbers();
  updateStats();
}

document.getElementById('info').addEventListener('click', () => {
  infoDialog.style.display = 'flex';
});

closeDialog.addEventListener('click', () => {
  infoDialog.style.display = 'none';
});

infoDialog.addEventListener('click', (e) => {
  if (e.target === infoDialog) {
    infoDialog.style.display = 'none';
  }
});

document.getElementById('settings').addEventListener('click', () => {
  settingsDialog.style.display = 'flex';
});

closeSettingsDialog.addEventListener('click', () => {
  settingsDialog.style.display = 'none';
});

settingsDialog.addEventListener('click', (e) => {
  if (e.target === settingsDialog) {
    settingsDialog.style.display = 'none';
  }
});

fontSelect.addEventListener('change', () => {
  setFont(fontSelect.value);
});

if (themeSelect) {
  themeSelect.addEventListener('change', () => {
    setSyntaxTheme(themeSelect.value);
  });
}

if (rawButton) {
  rawButton.addEventListener('click', () => {
    window.location.href = window.location.pathname + '/raw';
  });
}

document.addEventListener('readystatechange', () => {
  if (!isEditMode) {
    setupLanguageDisplay();
  } else {
    populateLanguageSelect();
    populateExpirationSelect();
  }

  const highlightLang = highlightLangMeta?.getAttribute('content');
  if (highlightLang && !isEditMode) {
    const text = getEditorContent();
    const html = hljs.highlight(text, {
      language: highlightLang,
    }).value;

    editor.innerHTML = html;
  }
});