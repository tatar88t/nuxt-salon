// @ts-nocheck

export const getOnlyDateFromISODate = (ISOdate) => {
  if (!ISOdate) return null;
  const [date, time] = ISOdate.split("T");

  return date;
};

export const getOnlyTimeFromISODate = (ISOdate) => {
  if (!ISOdate) return null;
  const [date, time] = ISOdate.split("T");

  return time;
};
