// Was previously checked as `state !== initialState`, a reference comparison
// that's true the instant any field changes (spreading into a new object
// always produces a new reference) - so the "fill in required fields" check
// never actually fired. This checks the fields themselves instead.
export function getMissingFields(state, requiredFields) {
  return requiredFields.filter((field) => {
    const value = state?.[field];
    return value === undefined || value === null || value === "";
  });
}
