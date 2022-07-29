export function formatTime(ts) {
  const now = new Date(ts * 1000);
  return now.toUTCString();
}

export function formatDuration(ts) {
  const days = Math.floor(ts / 86400);
  ts = ts % 86400;
  const hours = Math.floor(ts / 3600);
  ts = ts % 3600;
  const minutes = Math.floor(ts / 60);
  const seconds = ts % 60;
  var res = "";
  if (days === 1) {
    res += `${days} day `;
  } else if (days !== 0) {
    res += `${days} days `;
  }
  if (hours === 1) {
    res += `${hours} hour `;
  } else if (hours !== 0) {
    res += `${hours} hours `;
  }
  if (minutes === 1) {
    res += `${minutes} minute `;
  } else if (minutes !== 0) {
    res += `${minutes} minutes `;
  }
  if (seconds === 1) {
    res += `${seconds} second `;
  } else if (seconds !== 0) {
    res += `${seconds} seconds `;
  }
  if (!res) res = "0 seconds ";
  return res.substring(0, res.length - 1);
}
