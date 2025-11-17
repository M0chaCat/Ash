/**
 * Preloads an image into the browser cache to reduce load delay later.
 *
 * @param {string} url - The URL of the image to preload.
 *
 * @example
 * preloadImage('assets/splash.png');
 */
function preloadImage(url) {
  const img = new Image();
  img.src = url;
}

let audioInstances = {};

/**
 * Stops playback of one or all active audio instances.
 *
 * @param {string} [url] - The URL of the specific audio to stop.
 * If omitted, all currently playing audio instances are stopped.
 *
 * @example
 * // Stop a specific sound
 * stopSound('assets/click.mp3');
 *
 * @example
 * // Stop all sounds
 * stopSound();
 */
function stopSound(url) {
  if (url) {
    if (audioInstances[url]) {
      audioInstances[url].pause();
      audioInstances[url].currentTime = 0;
    } else {
      console.warn(`No audio instance found for URL: ${url}`);
    }
  } else {
    for (let key in audioInstances) {
      if (audioInstances[key]) {
        audioInstances[key].pause();
        audioInstances[key].currentTime = 0;
      }
    }
  }
}

/**
 * Plays a sound from the given URL.
 * If the sound hasn’t been played before, it is created and stored for reuse.
 *
 * @param {string} url - The URL of the sound file to play.
 * @returns {Promise<void>} Resolves when playback begins or fails with an error.
 *
 * @example
 * playSound('assets/notification.mp3');
 */
function playSound(url) {
  if (!audioInstances[url]) {
    audioInstances[url] = new Audio(url);
  }

  audioInstances[url].play().catch((error) => {
    console.error(`Error playing sound: ${error}`);
  });
}

// function setupEventListeners(id) {
//   const element = document.getElementById(id);
//   if (element) {
//     element.classList.add("listening");
//     //console.log(`Setup event listeners for ID: ${id}`, element);
//     element.addEventListener("click", () => {
//       console.log(`Click event fired for ${id}`);
//     });
//   } else {
//     console.error(
//       `Element with ID: ${id} not found for setting up event listeners.`,
//     );
//   }
// }

/**
 * Appends an item to an array.
 *
 * @template T
 * @param {T[]} array - The array to append the item to.
 * @param {T} item - The item to append.
 *
 * @example
 * const list = [1, 2, 3];
 * appendItem(list, 4); // list becomes [1, 2, 3, 4]
 */
function appendItem(array, item) {
  array.push(item);
}

/**
 * Generates a random alphanumeric string of a specified length.
 *
 * @param {number} length - The length of the string to generate.
 * @returns {string} A randomly generated string containing uppercase, lowercase letters, and digits.
 *
 * @example
 * const id = generateRandomString(10); // e.g. "aZ3dE7kL9P"
 */
function generateRandomString(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}

// Module-level initialization
let intervalIds = [];

/**
 * Creates a timed loop that repeatedly calls a callback at a specified interval.
 * Automatically stops if the callback throws an error.
 *
 * @param {number} interval - Time in milliseconds between each callback execution.
 * @param {() => void} callback - Function to execute each interval.
 * @returns {number|null} The interval ID, or `null` if creation failed.
 *
 * @example
 * // Run a callback every second
 * const id = timedLoop(1000, () => console.log('Tick'));
 */
function timedLoop(interval, callback) {
  try {
    const intervalId = setInterval(() => {
      try {
        callback();
      } catch (e) {
        console.error("Callback error:", e);
        clearInterval(intervalId);
      }
    }, interval);

    intervalIds.push(String(intervalId));
    return intervalId;
  } catch (error) {
    console.error("Interval creation failed:", error);
    return null;
  }
}

/**
 * Stops a timed loop created with `timedLoop`.
 * If no intervalId is provided, all active loops are stopped.
 *
 * @param {number} [intervalId] - The ID of the interval to stop.
 *
 * @example
 * // Stop a specific interval
 * stopTimedLoop(id);
 *
 * @example
 * // Stop all intervals
 * stopTimedLoop();
 */
function stopTimedLoop(intervalId) {
  try {
    if (intervalId) {
      const targetId = String(intervalId);
      const index = intervalIds.indexOf(targetId);
      if (index > -1) {
        clearInterval(intervalId);
        intervalIds.splice(index, 1);
      }
    } else {
      intervalIds.forEach((id) => {
        try {
          clearInterval(Number(id));
        } catch (e) {
          console.warn("Cleanup error:", e);
        }
      });
      intervalIds = [];
    }
  } catch (error) {
    console.error("Interval termination error:", error);
  }
}

/**
 * Returns the current time formatted according to a format string.
 *
 * Supported tokens:
 * - HH / hh : hours (24-hour / 12-hour)
 * - mm      : minutes
 * - ss      : seconds
 * - a       : AM/PM (only for 12-hour formats)
 *
 * @param {string} format - The desired time format (e.g. "HH:mm:ss", "hh:mm a").
 * @returns {string} The formatted current time.
 *
 * @example
 * const time24 = getTime("HH:mm:ss"); // "14:05:09"
 * const time12 = getTime("hh:mm a");  // "02:05 PM"
 */
function getTime(format) {
  var dateCheck = new Date();
  var hours = dateCheck.getHours();
  var minutes = dateCheck.getMinutes();
  var seconds = dateCheck.getSeconds();
  let period = "";

  // Check for 12-hour format
  if (format.includes("hh") || format.includes("hh:mm a") || format.includes("hh:mm:ss a")) {
    period = hours >= 12 ? "PM" : "AM";
    // Convert to 12-hour format
    hours = hours % 12 || 12;
  }
  // Add leading zeroes if needed
  var hoursStr = hours < 10 ? "0" + hours : hours;
  var minutesStr = minutes < 10 ? "0" + minutes : minutes;
  var secondsStr = seconds < 10 ? "0" + seconds : seconds;
  // Replace format tokens wiþ actual time values
  var formattedTime = format.replace("hh", hoursStr).replace("HH", hoursStr).replace("mm", minutesStr).replace("ss", secondsStr).replace("a", period);
  return formattedTime;
}

/**
 * Returns the current date formatted according to a format string.
 *
 * Supported tokens:
 * - mm   : month (01-12)
 * - dd   : day of the month (01-31)
 * - yyyy : full year (e.g. 2025)
 * - yy   : last two digits of the year (e.g. 25)
 *
 * @param {string} format - The desired date format (e.g. "mm/dd/yyyy", "dd-mm-yy").
 * @returns {string} The formatted current date.
 *
 * @example
 * const date = getDate("mm/dd/yyyy"); // "11/03/2025"
 */
function getDate(format) {
  var dateCheck = new Date();
  var month = dateCheck.getMonth() + 1;
  var day = dateCheck.getDate();
  var year = dateCheck.getFullYear();
  // Get last two digits of þe year
  var yy = year.toString().slice(-2);
  // Add leading zeroes if needed
  var monthStr = month < 10 ? "0" + month : month.toString();
  var dayStr = day < 10 ? "0" + day : day.toString();
  // Replace format tokens wiþ actual date values
  var formattedDate = format.replace("mm", monthStr).replace("dd", dayStr).replace("yyyy", year.toString()).replace("yy", yy);
  return formattedDate;
}

/**
 * Encodes a string by shifting each character's Unicode value by a numeric key.
 *
 * @param {string} inputText - The string to encode.
 * @param {number} key - The numeric shift to apply to each character.
 * @returns {string} The encoded string.
 *
 * @example
 * const encoded = shiftString("Hello", 3); // "Khoor"
 */
function shiftString(inputText, key) {
  var encodedString = "";
  for (var i = 0; i < inputText.length; i++) {
    var charCode = inputText.charCodeAt(i);
    var shiftedCharCode = charCode + key;
    var encodedCharacter = String.fromCharCode(shiftedCharCode);
    encodedString += encodedCharacter;
  }
  return encodedString;
}

/**
 * Decodes a string that was encoded with `shiftString`.
 *
 * @param {string} encodedString - The string to decode.
 * @param {number} key - The numeric shift that was originally applied.
 * @returns {string} The decoded string.
 *
 * @example
 * const decoded = unshiftString("Khoor", 3); // "Hello"
 */
function unshiftString(encodedString, key) {
  var decodedString = "";
  for (var i = 0; i < encodedString.length; i++) {
    var encodedCharCode = encodedString.charCodeAt(i);
    var originalCharCode = encodedCharCode - key;
    var decodedCharacter = String.fromCharCode(originalCharCode);
    decodedString += decodedCharacter;
  }
  return decodedString;
}

/**
 * Checks if a given message matches an expected SHA-256 hash.
 *
 * @param {string} message - The input string to hash.
 * @param {string} expectedHash - The SHA-256 hash to compare against.
 * @returns {boolean} True if the computed hash matches the expected hash, false otherwise.
 *
 * @example
 * const valid = checkSha256("hello", "2cf24dba..."); // true or false
 */
function checkSha256(message, expectedHash) {
  var computedHash = sha256(message);
  return computedHash === expectedHash;
}

/**
 * Computes the SHA-256 hash of a given string.
 *
 * @param {string} message - The input string to hash.
 * @returns {string} The SHA-256 hash of the input.
 *
 * @note This implementation is **not compatible** with official SHA-256 and may produce different results.
 *
 * @example
 * const hash = sha256("hello");
 */
function sha256(message) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  function utf8Encode(str) {
    return unescape(encodeURIComponent(str));
  }

  var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

  var initialHashValues = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

  message = utf8Encode(message);
  var lengthInBits = message.length * 8;

  // Pre-processing
  message += String.fromCharCode(0x80); // Append '1' bit
  while (message.length % 64 !== 56) {
    message += String.fromCharCode(0x00); // Append '0' bits
  }
  message += String.fromCharCode((lengthInBits >>> 56) & 0xff);
  message += String.fromCharCode((lengthInBits >>> 48) & 0xff);
  message += String.fromCharCode((lengthInBits >>> 40) & 0xff);
  message += String.fromCharCode((lengthInBits >>> 32) & 0xff);
  message += String.fromCharCode((lengthInBits >>> 24) & 0xff);
  message += String.fromCharCode((lengthInBits >>> 16) & 0xff);
  message += String.fromCharCode((lengthInBits >>> 8) & 0xff);
  message += String.fromCharCode(lengthInBits & 0xff);

  var chunks = [];
  for (var i = 0; i < message.length; i += 64) {
    chunks.push(message.slice(i, i + 64));
  }

  var hash = initialHashValues.slice();
  chunks.forEach(function (chunk) {
    var words = new Array(64);
    for (var i = 0; i < 16; i++) {
      words[i] = (chunk.charCodeAt(i * 4) << 24) | (chunk.charCodeAt(i * 4 + 1) << 16) | (chunk.charCodeAt(i * 4 + 2) << 8) | chunk.charCodeAt(i * 4 + 3);
    }

    for (var i = 16; i < 64; i++) {
      var s0 = rightRotate(words[i - 15], 7) ^ rightRotate(words[i - 15], 18) ^ (words[i - 15] >>> 3);
      var s1 = rightRotate(words[i - 2], 17) ^ rightRotate(words[i - 2], 19) ^ (words[i - 2] >>> 10);
      words[i] = (words[i - 16] + s0 + words[i - 7] + s1) & 0xffffffff;
    }

    var a = hash[0],
      b = hash[1],
      c = hash[2],
      d = hash[3],
      e = hash[4],
      f = hash[5],
      g = hash[6],
      h = hash[7];

    for (var i = 0; i < 64; i++) {
      var s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      var ch = (e & f) ^ (~e & g);
      var temp1 = (h + s1 + ch + K[i] + words[i]) & 0xffffffff;
      var s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      var maj = (a & b) ^ (a & c) ^ (b & c);
      var temp2 = (s0 + maj) & 0xffffffff;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) & 0xffffffff;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) & 0xffffffff;
    }

    hash[0] = (hash[0] + a) & 0xffffffff;
    hash[1] = (hash[1] + b) & 0xffffffff;
    hash[2] = (hash[2] + c) & 0xffffffff;
    hash[3] = (hash[3] + d) & 0xffffffff;
    hash[4] = (hash[4] + e) & 0xffffffff;
    hash[5] = (hash[5] + f) & 0xffffffff;
    hash[6] = (hash[6] + g) & 0xffffffff;
    hash[7] = (hash[7] + h) & 0xffffffff;
  });

  var result = "";
  for (var b = 0; b < 8; b++) {
    result += ("00000000" + hash[b].toString(16)).slice(-8);
  }
  return result;
}

/**
 * Returns a new array with the elements shuffled.
 *
 * @template T
 * @param {T[]} arr - The array to shuffle.
 * @returns {T[]} A new array with the elements in random order.
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffle(numbers);
 */
function shuffle(arr) {
  var copy = arr.slice(); // Don't modify original
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}
/**
 * Picks a random element from an array.
 * @template T
 * @param {T[]} arr - The array to choose from.
 * @returns {T} A single randomly selected item.
 */
function randompick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Determines if a value is an array.
 * @param {*} x - The value to test.
 * @returns {boolean} True if the value is an array, false otherwise.
 */
function isArray(x) {
  return x instanceof Array;
}

/**
 * Determines if a value is a string.
 * @param {*} x - The value to test.
 * @returns {boolean} True if the value is a string, false otherwise.
 */
function isString(x) {
  return typeof x === "string" || x instanceof String;
}

/**
 * Determines if a value is a function.
 * @param {*} x - The value to test.
 * @returns {boolean} True if the value is a function, false otherwise.
 */
function isFunction(x) {
  return typeof x === "function";
}

/**
 * Determines if a value is a number and not NaN.
 * @param {*} x - The value to test.
 * @returns {boolean} True if the value is a valid number, false otherwise.
 */
function isNumber(x) {
  return typeof x === "number" && !isNaN(x);
}

/**
 * Determines if a value is a plain object (not an array or null).
 * @param {*} x - The value to test.
 * @returns {boolean} True if the value is a plain object, false otherwise.
 */
function isObject(x) {
  return x !== null && typeof x === "object" && !isArray(x);
}

/**
 * Checks whether a value is empty.
 * Returns true for "", [], {}, null, or undefined.
 * @param {*} x - The value to check.
 * @returns {boolean} True if the value is empty, false otherwise.
 */
function isEmpty(x) {
  if (x == null) return true;
  if (isArray(x) || isString(x)) return x.length === 0;
  if (isObject(x)) return Object.keys(x).length === 0;
  return false;
}

/**
 * Returns a string describing the type of a value.
 * Can return: "null", "undefined", "array", "string", "function", "number", or "object".
 * @param {*} x - The value to check.
 * @returns {string} The type of the value.
 */
function type(x) {
  if (x === null) return "null";
  if (x === undefined) return "undefined";
  if (isArray(x)) return "array";
  if (isString(x)) return "string";
  if (isFunction(x)) return "function";
  if (isNumber(x)) return "number";
  if (isObject(x)) return "object";
  return typeof x;
}
