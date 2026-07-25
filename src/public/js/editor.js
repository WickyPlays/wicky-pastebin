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
const languageSelect = document.getElementById('languageSelect');
const highlightLangMeta = document.querySelector('meta[name="highlight-language"]');
const languageDisplay = document.getElementById('languageDisplay');

const isEditMode = editor.tagName === 'TEXTAREA';

const DEFAULT_LANGUAGE = 'auto';

const languages = [
  { value: 'auto', label: 'Auto-detect' },

  { value: 'plaintext', label: 'Plain Text' },

  // Web
  { value: 'html', label: 'HTML' },
  { value: 'xml', label: 'XML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'sass', label: 'Sass' },
  { value: 'less', label: 'Less' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'React JSX' },
  { value: 'tsx', label: 'React TSX' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'toml', label: 'TOML' },

  // C Family
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'objectivec', label: 'Objective-C' },

  // JVM
  { value: 'java', label: 'Java' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'scala', label: 'Scala' },
  { value: 'groovy', label: 'Groovy' },

  // Microsoft
  { value: 'powershell', label: 'PowerShell' },
  { value: 'vbnet', label: 'VB.NET' },
  { value: 'fsharp', label: 'F#' },

  // Systems
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'zig', label: 'Zig' },
  { value: 'swift', label: 'Swift' },

  // Scripting
  { value: 'python', label: 'Python' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'perl', label: 'Perl' },
  { value: 'lua', label: 'Lua' },
  { value: 'r', label: 'R' },

  // Functional
  { value: 'haskell', label: 'Haskell' },
  { value: 'elixir', label: 'Elixir' },
  { value: 'erlang', label: 'Erlang' },
  { value: 'clojure', label: 'Clojure' },
  { value: 'ocaml', label: 'OCaml' },

  // Databases
  { value: 'sql', label: 'SQL' },
  { value: 'pgsql', label: 'PostgreSQL' },

  // Shell
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'zsh', label: 'Zsh' },
  { value: 'dos', label: 'Batch' },

  // Config / DevOps
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'nginx', label: 'Nginx' },
  { value: 'apache', label: 'Apache' },
  { value: 'ini', label: 'INI' },
  { value: 'properties', label: 'Properties' },

  // Markup
  { value: 'markdown', label: 'Markdown' },
  { value: 'latex', label: 'LaTeX' },

  // Misc
  { value: 'diff', label: 'Diff' },
  { value: 'makefile', label: 'Makefile' },
  { value: 'cmake', label: 'CMake' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'protobuf', label: 'Protocol Buffers' },
  { value: 'vim', label: 'Vim Script' }
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

setTheme(getTheme());
setFont(getFont());

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

async function saveFile() {
  let content = getEditorContent();
  let language = document.getElementById('languageSelect').value;

  if (language === DEFAULT_LANGUAGE) {
    language = hljs.highlightAuto(content).language;
  }

  const response = await fetch("/", {
    method: "POST",
    body: JSON.stringify({ content, language }),
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
    }
  });
  editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
  });
  updateLineNumbers();
  updateStats();
} else {
  editor.parentElement.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.parentElement.scrollTop;
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

document.addEventListener('readystatechange', () => {
  if (!isEditMode) {
    setupLanguageDisplay();
  } else {
    populateLanguageSelect();
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