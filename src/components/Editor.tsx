import { InfoDialog } from './InfoDialog';
import { SettingsDialog } from './SettingsDialog';

interface EditorProps {
  content?: string;
  language?: string;
  edit: boolean;
}

export const Editor = ({ content = '', language, edit }: EditorProps) => {

  return (
    <>
      <head>
        <title>WickyPastebin - {language ? `${language} ` : ''}Editor</title>
        <link rel="stylesheet" href="/css/editor.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/default.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {language && <meta name="highlight-language" content={language} />}
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <h1 class="header-title" onclick="window.location.href = '/';">WickyPastebin</h1>
            {edit ? (
              <select class="language-select" id="languageSelect"></select>
            ) : (
              <span class="language-display" id="languageDisplay"></span>
            )}
          </div>
          <div class="header-right">
            <div id="stats-info">
              <span id="charCount">0</span> chars
              <span class="separator"></span>
              <span id="lineCount">0</span> lines
              <span class="separator"></span>
              <span id="wordCount">0</span> words
              <span class="separator"></span>
              <span id="sizeCount">0</span>
            </div>
            <div class="icon" id="themeToggle" title="Toggle Theme">
              <img src="/img/icons/sun.svg" alt="Toggle Theme" id="themeIcon" />
            </div>
            {edit && (
              <div class="icon" id="save" title="Save" onclick="saveFile()">
                <img src="/img/icons/save.svg" alt="Save" />
              </div>
            )}
            <div class="icon" id="settings" title="Settings">
              <img src="/img/icons/settings.svg" alt="Settings" />
            </div>
            <div class="icon" id="info" title="Info">
              <img src="/img/icons/info.svg" alt="Info" />
            </div>
          </div>
        </div>
        <div class="editor-container">
          <div class="line-numbers" id="lineNumbers"></div>
          {edit ? (
            <textarea class="editor" id="editor" placeholder="Type or paste your content here...">{content}</textarea>
          ) : (
            <pre class="editor"><code class="hljs" id="editor">{content}</code></pre>
          )}
        </div>
        <InfoDialog />
        <SettingsDialog />
        <script src="/js/editor.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>
      </body>
    </>
  );
};
