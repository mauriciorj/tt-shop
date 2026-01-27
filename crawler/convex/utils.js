export const getArrayUpdatedValues = ({ key, currentData, newData }) =>
  Boolean(
    !currentData[key] ||
      currentData[key].length !== newData[key].length ||
      currentData[key].some((val, index) => val !== newData[key][index])
  );

export const getUpdatedValues = ({ currentData, newData }) => {
  const updates = {};

  Object.keys(newData).forEach((key) => {
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
