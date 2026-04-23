export const getArrayUpdatedValues = ({
  key,
  currentData,
  newData,
}: {
  key: string
  currentData: any
  newData: any
}) =>
  Boolean(
    !currentData[key] ||
    currentData[key].length !== newData[key].length ||
    currentData[key].some((val: any, index: any) => val !== newData[key][index])
  )

export const getUpdatedValues = ({
  currentData,
  newData,
}: {
  currentData: any
  newData: any
}) => {
  const updates = {} as Record<string, any>

  Object.keys(newData).forEach((key: string) => {
    if (['updated_at', 'k_id'].includes(key)) return

    if (Array.isArray(newData[key])) {
      if (getArrayUpdatedValues({ key, currentData, newData })) {
        updates[key] = newData[key]
      }
    } else {
      if (currentData[key] !== newData[key]) {
        updates[key] = newData[key]
      }
    }
  })

  return updates
}

// Returns ISO week string "YYYY-Www" (e.g. "2025-W15")
export const isoWeek = (date: Date): string => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const yearStart = new Date(d.getFullYear(), 0, 4)
  const week =
    1 +
    Math.round(
      ((d.getTime() - yearStart.getTime()) / 86400000 -
        3 +
        ((yearStart.getDay() + 6) % 7)) /
        7
    )
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}
