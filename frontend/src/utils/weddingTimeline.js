export const WEDDING_TIMELINE_ITEMS = [
  { id: 'ceremony', title: 'Wedding Ceremony', time: '3:00 PM' },
  { id: 'pictorial', title: 'Pictorial', time: '4:00 PM' },
  { id: 'cocktail', title: 'Cocktail Hour', time: '4:30 PM' },
  { id: 'program', title: 'Program Proper', time: '6:00 PM' },
  { id: 'dinner', title: 'Dinner', time: '7:00 PM' },
  { id: 'sde', title: 'Same Day Edit Photo and Video', time: '8:30 PM' },
];

export const defaultWeddingProgram = () => WEDDING_TIMELINE_ITEMS.map(({ title, time }) => ({
  title,
  time,
}));

function findSavedItem(program, template, index) {
  if (!Array.isArray(program)) return null;

  const byTitle = program.find((item) => {
    const title = item?.title?.trim().toLowerCase();
    if (!title || title === 'band first set') return false;
    return title === template.title.toLowerCase();
  });
  if (byTitle) return byTitle;

  const legacy = program[index];
  if (legacy?.title?.trim().toLowerCase() === 'band first set') return null;
  return legacy || null;
}

/** Keep wedding timeline titles fixed; only times are editable. */
export function normalizeWeddingProgram(program) {
  return WEDDING_TIMELINE_ITEMS.map((template, index) => {
    const saved = findSavedItem(program, template, index);
    return {
      id: template.id,
      title: template.title,
      time: saved?.time?.trim() || template.time,
    };
  });
}
