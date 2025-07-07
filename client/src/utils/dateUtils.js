import axios from "axios";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

export const getDayName = (dateString) => {
  const dayNames = [
    "Sunday",
    "Monday", 
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return dayNames[new Date(dateString).getDay()];
};

/**
 * Fetches the current UTC date from timeapi.io.
 * Falls back to system time if the API fails.
 * @returns {Promise<Date>} A promise that resolves to a Date object (UTC)
 */
export async function getTrustedUtcDate() {
  try {
    const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC', { method: 'GET', timeout: 3000 });
    const data = await response.json();
    if (data && data.dateTime) {
      return new Date(data.dateTime);
    }
    throw new Error('Invalid response from time API');
  } catch (err) {
    // Fallback to system time
    return new Date();
  }
}

