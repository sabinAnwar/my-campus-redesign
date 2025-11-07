// Utility functions for managing recently visited courses in localStorage

const LS_KEY = 'recentlyVisitedCourses';

/**
 * Save a course visit to the recent courses list
 * @param {Object} course - Course object with id, name, and other details
 */
export function saveRecentCourse(course) {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    const recentCourses = Array.isArray(stored) ? stored : [];
    
    const entry = {
      id: course.id ?? course.name,
      name: course.name,
      studiengang: course.studiengang ?? null,
      semester: course.semester ?? null,
      color: course.color ?? 'blue',
      visitedAt: Date.now(),
    };
    
    // Remove duplicates (same course ID) and add new entry at top
    const dedup = recentCourses.filter((c) => c.id !== entry.id);
    const next = [entry, ...dedup].slice(0, 6); // Keep last 6 visited courses
    
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    
    return next;
  } catch (error) {
    console.error('Failed to save recent course:', error);
    return [];
  }
}

/**
 * Get the list of recently visited courses
 * @param {number} limit - Maximum number of courses to return (default: 6)
 * @returns {Array} Array of recent course objects
 */
export function getRecentCourses(limit = 6) {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    const recentCourses = Array.isArray(stored) ? stored : [];
    return recentCourses.slice(0, limit);
  } catch (error) {
    console.error('Failed to get recent courses:', error);
    return [];
  }
}

/**
 * Clear all recently visited courses
 */
export function clearRecentCourses() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch (error) {
    console.error('Failed to clear recent courses:', error);
  }
}

/**
 * Remove a specific course from recent courses
 * @param {string|number} courseId - ID of the course to remove
 */
export function removeRecentCourse(courseId) {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    const recentCourses = Array.isArray(stored) ? stored : [];
    const filtered = recentCourses.filter((c) => c.id !== courseId);
    localStorage.setItem(LS_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to remove recent course:', error);
    return [];
  }
}
