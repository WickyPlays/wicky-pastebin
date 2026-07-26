export const InfoDialog = () => {
  return (
    <div class="dialog-backdrop" id="infoDialog">
      <div class="dialog">
        <div class="dialog-header">
          <h2>About WickyPastebin</h2>
          <button class="dialog-close" id="closeDialog">&times;</button>
        </div>
        <div class="dialog-content">
          <p>Wicky Pastebin is a simple text sharing application.</p>
          <p>Share your code snippets, notes, or any text content with others easily.</p>
        </div>
      </div>
    </div>
  );
};
