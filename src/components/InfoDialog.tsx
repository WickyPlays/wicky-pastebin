export const InfoDialog = () => {
  return (
    <div class="dialog-backdrop" id="infoDialog">
      <div class="dialog">
        <div class="dialog-header">
          <h2>About WickyPastebin</h2>
          <button class="dialog-close" id="closeDialog">&times;</button>
        </div>
        <div class="dialog-content">
          <p>WickyPastebin is a simple text sharing application.</p>
          <p>Share your code snippets, notes, or any text content with others easily.</p>
          <p>This app works in the form of open-source nature, so contribution may be helpful to me to improve this app to you and everyone.</p>
          <p>Github: <a href="https://github.com/WickyPlays/wicky-pastebin" target="_blank">https://github.com/WickyPlays/wicky-pastebin</a></p>
        </div>
        <div class="dialog-content">
          <p>For more support, reach out to me at: baottworkspace@gmail.com</p>
        </div>
      </div>
    </div>
  );
};
