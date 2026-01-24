export const COURSES_META = [
  { id: 1, active: true },
  { id: 2, active: true },
  { id: 3, active: true },
  { id: 4, active: true },
  { id: 5, active: true },
  { id: 6, active: true },
  { id: 7, active: false },
  { id: 8, active: false },
];

export const ACTIVE_COURSES_COUNT = COURSES_META.filter(
  (c) => c.active
).length;

