export const SettingsDialog = () => {
  return (
    <div class="dialog-backdrop" id="settingsDialog">
      <div class="dialog">
        <div class="dialog-header">
          <h2>Settings</h2>
          <button class="dialog-close" id="closeSettingsDialog">&times;</button>
        </div>
        <div class="dialog-content">
          <div class="setting-group">
            <label for="fontSelect">Editor Font</label>
            <select id="fontSelect">
              <option value="'Courier New', monospace">Courier New</option>
              <option value="'Fira Code', monospace">Fira Code</option>
              <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
              <option value="'Source Code Pro', monospace">Source Code Pro</option>
              <option value="'Consolas', monospace">Consolas</option>
              <option value="'Monaco', monospace">Monaco</option>
              <option value="monospace">Monospace (System)</option>
            </select>
          </div>
          <div class="setting-group">
            <label for="themeSelect">Syntax Theme</label>
            <select id="themeSelect">
              <option value="default">Default</option>
              <option value="github-dark">GitHub Dark</option>
              <option value="atom-one-dark">Atom One Dark</option>
              <option value="atom-one-light">Atom One Light</option>
              <option value="dracula">Dracula</option>
              <option value="nord">Nord</option>
              <option value="monokai">Monokai</option>
              <option value="vs2015">Visual Studio 2015</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
