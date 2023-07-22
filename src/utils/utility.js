export const genId = (type = "node") => {
  const hexDigits = "abcdefghiklmnoqprstvwxyz";
  let uuid = "";

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * 16);
    const digit = hexDigits[randomIndex];
    uuid += digit;

    if (i === 7 || i === 11 || i === 15 || i === 19) {
      uuid += "-";
    }
  }
  switch (type) {
    case "in":
      uuid = uuid + "-in";
      break;
    case "out":
      uuid = uuid + "-out";
      break;
    default:
      break;
  }
  return uuid;
};
