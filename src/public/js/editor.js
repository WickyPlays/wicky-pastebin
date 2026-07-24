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

const isEditMode = editor.tagName === 'TEXTAREA';

const DEFAULT_LANGUAGE = 'auto';

const languages = [
  {
    value: 'auto',
    label: 'Auto-detect'
  },
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' }
];

function populateLanguageSelect() {
  languageSelect.innerHTML = '';
  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.value;
    option.textContent = lang.label;
    languageSelect.appendChild(option);
  });
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
populateLanguageSelect();

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
  const highlightLang = highlightLangMeta?.getAttribute('content');
  if (highlightLang && !isEditMode) {
    languageSelect.value = highlightLang;

    const text = getEditorContent();
    const html = hljs.highlight(text, {
      language: highlightLang,
    }).value;

    editor.innerHTML = html;
  }
});