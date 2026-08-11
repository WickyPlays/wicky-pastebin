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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`Paste - ${language}`} />
        <meta property="og:description" content={content.slice(0, 200)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://yourdomain.com/${language}`} />
        <meta property="og:image" content={`https://yourdomain.com/og/${language}.png`} />

        {language && <meta name="highlight-language" content={language} />}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/default.min.css" id="highlight-theme" />
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <h1 class="header-title" onclick="window.location.href = '/';">WickyPastebin</h1>
            {edit ? (
              <>
                <select class="language-select" id="languageSelect"></select>
                <select class="expiration-select" id="expirationSelect"></select>
              </>
            ) : (
              <span class="language-display" id="languageDisplay"></span>
            )}
          </div>
          <div class="header-right">
            {!edit && (
              <div class="icon" id="raw-button" title="Raw">
                <img src="/img/icons/raw.svg" alt="Raw" class="icon-img" />
                <span>Raw</span>
              </div>
            )}
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
              <div class="icon" id="save" title="Save" onclick="saveFile()" disabled>
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
            <div class="editor-wrapper">
              <textarea id="editor" placeholder="Type or paste your content here..." wrap="off">{content}</textarea>
            </div>
          ) : (
            <div class="editor-wrapper">
              <pre id="editor"><code class="hljs">{content}</code></pre>
            </div>
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
