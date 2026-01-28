export const getArrayUpdatedValues = ({
  key,
  currentData,
  newData,
}: {
  key: string;
  currentData: any;
  newData: any;
}) =>
  Boolean(
    !currentData[key] ||
      currentData[key].length !== newData[key].length ||
      currentData[key].some(
        (val: any, index: any) => val !== newData[key][index]
      )
  );

export const getUpdatedValues = ({
  currentData,
  newData,
}: {
  currentData: any;
  newData: any;
}) => {
  const updates = {} as Record<string, any>;

  Object.keys(newData).forEach((key: string) => {
    if (["updated_at", "k_id"].includes(key)) return;

    if (Array.isArray(newData[key])) {
      if (getArrayUpdatedValues({ key, currentData, newData })) {
        updates[key] = newData[key];
      }
    } else {
      if (currentData[key] !== newData[key]) {
        updates[key] = newData[key];
      }
    }
  });

  return updates;
};
