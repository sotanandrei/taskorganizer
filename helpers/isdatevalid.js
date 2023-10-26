export function isValidDateInput(input) {
  const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  if (!datePattern.test(input)) {
    // The input does not match the expected format
    return false;
  }

  // Split the input into month, day, and year
  const [month, day, year] = input.split("/").map(Number);

  // Check if the month, day, and year are valid
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 2023) {
    // Invalid month, day, or year
    return false;
  }

  // Additional checks if needed (e.g., check for leap years)

  return true;
}
