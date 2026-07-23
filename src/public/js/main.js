const editor = document.getElementById('editor');
const lineNumbers = document.getElementById('lineNumbers');
const infoDialog = document.getElementById('infoDialog');
const closeDialog = document.getElementById('closeDialog');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

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

setTheme(getTheme());

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

function updateLineNumbers() {
  const lines = editor.value.split('\n');
  lineNumbers.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
}

editor.addEventListener('input', updateLineNumbers);
editor.addEventListener('scroll', () => {
  lineNumbers.scrollTop = editor.scrollTop;
});
updateLineNumbers();

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
