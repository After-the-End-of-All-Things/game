export function startOfLastWeek(): Date {
  const startOfLastWeek = new Date();
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  startOfLastWeek.setHours(0);
  startOfLastWeek.setMinutes(0);
  startOfLastWeek.setSeconds(0);
  startOfLastWeek.setMilliseconds(0);

  return startOfLastWeek;
}

export function startOfToday(): Date {
  const startOfToday = new Date();
  startOfToday.setHours(0);
  startOfToday.setMinutes(0);
  startOfToday.setSeconds(0);
  startOfToday.setMilliseconds(0);

  return startOfToday;
}

export function endOfToday(): Date {
  const endOfToday = new Date();
  endOfToday.setHours(23);
  endOfToday.setMinutes(59);
  endOfToday.setSeconds(59);
  endOfToday.setMilliseconds(999);

  return endOfToday;
}
