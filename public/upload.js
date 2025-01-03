document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
  
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'text/plain') {
        const reader = new FileReader();
  
        reader.onload = (e) => {
          const content = e.target.result;
          const noteId = Date.now().toString();
  
          browser.storage.local.get(['sheets'], (result) => {
            const sheets = result.sheets || [];
            sheets.push({
              id: noteId,
              name: file.name.replace('.txt', ''),
              content,
              tags: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
  
            browser.storage.local.set({ sheets }, () => {
              console.log('Sheet saved.');
              window.close(); // Закриває вікно після завантаження
            });
          });
        };
  
        reader.readAsText(file);
      }
    });
  });
  