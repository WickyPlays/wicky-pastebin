export const NotFound = () => {
  return (
    <>
      <head>
        <title>404 - Paste Not Found | WickyPastebin</title>
        <link rel="stylesheet" href="/css/notfound.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div class="notfound-header">
          <div class="icon" id="themeToggle" title="Toggle Theme">
            <img src="/img/icons/sun.svg" alt="Toggle Theme" id="themeIcon" />
          </div>
        </div>
        <div class="notfound-container">
          <div class="notfound-content">
            <div class="error-code">404</div>
            <h1 class="error-title">Paste Not Found</h1>
            <p class="error-message">
              Well, this is awkward...
            </p>
            <p class="error-submessage">
              The URL may be incorrect or the paste may have expired.
            </p>
            <div class="error-actions">
              <a href="/" class="btn-primary">Go to Homepage</a>
            </div>
          </div>
        </div>
        <script src="/js/notfound.js"></script>
      </body>
    </>
  );
};
