function filterArrayOfObjectAndRemoveRepetitions(arr, property) {
  const uniqueValues = new Set();
  const filteredArr = arr.filter((obj) => {
    if (!uniqueValues.has(obj[property])) {
      uniqueValues.add(obj[property]);
      return true;
    }
    return false;
  });
  return filteredArr;
}

async function CheckAllRequiredFieldsAvailaible(req, fields, res) {
  const missingField = fields.find(
    (field) => req?.[field] === null || req?.[field] === undefined || req?.[field] === ""
  );

  if (missingField) {
    res
      .status(400)
      .json({ status: 400, message: `Please Fill the Required Field ${missingField}` });
    return true;
  }

  return false;
}

module.exports = {
  filterArrayOfObjectAndRemoveRepetitions,
  CheckAllRequiredFieldsAvailaible,
};
