export const formatNote = (note: number): string => {
  return note % 1 === 0 ? note.toFixed(0) : note.toFixed(2);
};
