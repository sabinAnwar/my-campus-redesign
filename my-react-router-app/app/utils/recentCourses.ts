// Utility functions for managing recently visited courses in localStorage

const getStorageKey = (userId?: number | string) => userId ? `recentlyVisitedCourses_${userId}` : 'recentlyVisitedCourses';

/**
 * Save a course visit to the recent courses list
 * @param {Object} course - Course object with id, name, and other details
 * @param {number|string} [userId] - The ID of the current user to isolate data
 */
export function saveRecentCourse(course: { id: any; name: any; studiengang: any; semester: any; color: any; }, userId?: number | string) {
  try {
    const key = getStorageKey(userId);
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    const recentCourses = Array.isArray(stored) ? stored : [];
    
    const entry = {
      id: course.id ?? course.name,
      name: course.name,
      studiengang: course.studiengang ?? null,
      semester: course.semester ?? null,
      color: course.color ?? 'blue',
      visited_at: Date.now(),
    };
    
    // Remove duplicates (same course ID) and add new entry at top
    const dedup = recentCourses.filter((c: any) => c.id !== entry.id);
    const next = [entry, ...dedup].slice(0, 6); // Keep last 6 visited courses
    
    localStorage.setItem(key, JSON.stringify(next));
    
    return next;
  } catch (error) {
    console.error('Failed to save recent course:', error);
    return [];
  }
}

/**
 * Get the list of recently visited courses
 * @param {number} limit - Maximum number of courses to return (default: 6)
 * @param {number|string} [userId] - The ID of the current user
 * @returns {Array} Array of recent course objects
 */
export function getRecentCourses(limit = 6, userId?: number | string) {
  try {
    const key = getStorageKey(userId);
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    const recentCourses = Array.isArray(stored) ? stored : [];
    return recentCourses.slice(0, limit);
  } catch (error) {
    console.error('Failed to get recent courses:', error);
    return [];
  }
}

/**
 * Clear all recently visited courses
 * @param {number|string} [userId] - The ID of the current user
 */
export function clearRecentCourses(userId?: number | string) {
  try {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear recent courses:', error);
  }
}

/**
 * Remove a specific course from recent courses
 * @param {string|number} courseId - ID of the course to remove
 * @param {number|string} [userId] - The ID of the current user
 */
export function removeRecentCourse(courseId: any, userId?: number | string) {
  try {
    const key = getStorageKey(userId);
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    const recentCourses = Array.isArray(stored) ? stored : [];
    const filtered = recentCourses.filter((c: any) => c.id !== courseId);
    localStorage.setItem(key, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to remove recent course:', error);
    return [];
  }
}
