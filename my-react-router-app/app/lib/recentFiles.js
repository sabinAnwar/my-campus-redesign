// Utility functions for managing recent files in localStorage
// This allows recent files tracking to work even when /files route is removed

const LS_KEYS = {
  recentFiles: 'recentFilesList',
  readingStates: 'fileReadingStates',
  lastOpened: 'lastOpenedFile'
};

/**
 * Save a file to the recent files list
 * @param {Object} file - File object with id, name, type, url
 * @param {string} moduleLabel - Course/module name
 * @param {string} studiengangName - Studiengang name (optional)
 */
export function saveRecentFile(file, moduleLabel, studiengangName) {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEYS.recentFiles) || '[]');
    const recentFiles = Array.isArray(stored) ? stored : [];
    
    // Generate unique ID if not provided
    const fileId = file.id ?? `${file.name}-${Date.now()}`;
    
    // Detect file type from extension if not provided
    let fileType = file.type;
    if (!fileType) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') fileType = 'pdf';
      else if (ext === 'xlsx' || ext === 'xls') fileType = 'excel';
      else if (ext === 'mp3' || ext === 'mp4' || ext === 'wav') fileType = 'podcast';
      else fileType = ext || 'file';
    }
    
    const entry = {
      id: fileId,
      name: file.name,
      moduleName: moduleLabel ?? 'Unbekannter Kurs',
      studiengang: studiengangName ?? null,
      fileType: fileType,
      url: file.url || null,
      at: Date.now(),
    };
    
    // Remove duplicates (same file ID) and add new entry at top
    const dedup = recentFiles.filter((f) => f.id !== entry.id);
    const next = [entry, ...dedup].slice(0, 30); // Increased to 30 for better history
    
    localStorage.setItem(LS_KEYS.recentFiles, JSON.stringify(next));
    localStorage.setItem(LS_KEYS.lastOpened, JSON.stringify(entry));
    
    return next;
  } catch (error) {
    console.error('Error saving recent file:', error);
    return [];
  }
}

/**
 * Get the list of recent files
 * @returns {Array} Array of recent file entries
 */
export function getRecentFiles() {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEYS.recentFiles) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error('Error getting recent files:', error);
    return [];
  }
}

/**
 * Update reading state for a PDF file
 * @param {string} fileId - File ID
 * @param {Object} readingState - Reading state object
 */
export function updateReadingState(fileId, readingState) {
  try {
    const states = JSON.parse(localStorage.getItem(LS_KEYS.readingStates) || '{}');
    states[fileId] = {
      ...states[fileId],
      ...readingState,
      lastUpdated: Date.now()
    };
    localStorage.setItem(LS_KEYS.readingStates, JSON.stringify(states));
  } catch (error) {
    console.error('Error updating reading state:', error);
  }
}

/**
 * Get reading state for a file
 * @param {string} fileId - File ID
 * @returns {Object|null} Reading state object or null
 */
export function getReadingState(fileId) {
  try {
    const states = JSON.parse(localStorage.getItem(LS_KEYS.readingStates) || '{}');
    return states[fileId] || null;
  } catch (error) {
    console.error('Error getting reading state:', error);
    return null;
  }
}

/**
 * Clear all recent files
 */
export function clearRecentFiles() {
  try {
    localStorage.setItem(LS_KEYS.recentFiles, '[]');
    localStorage.removeItem(LS_KEYS.lastOpened);
  } catch (error) {
    console.error('Error clearing recent files:', error);
  }
}

