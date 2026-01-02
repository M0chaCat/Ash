// Ash Element API
function AEA({ type, id, position = { x: 0, y: 0 }, size = { width: 100, height: 40 }, border = { width: 0, color: "transparent", radius: 0 }, colors = { bg: "transparent", text: "#000" }, text = { content: "", align: "left", size: 14, font: "sans-serif" }, readOnly = false, imageUrl = null, classNames = "", css = {} }) {
  let element;

  //
  // --- ELEMENT CREATION ---
  //
  if (type === "Button") {
    element = document.createElement("button");
  } else if (type === "Image") {
    element = document.createElement("img");
  } else if (type === "Input") {
    element = document.createElement("input");
    element.type = "text";
  } else if (type === "TextArea") {
    element = document.createElement("textarea");
  } else {
    element = document.createElement(type);
  }

  element.id = id;

  //1
  // --- POSITION & SIZE ---
  //
  element.style.position = "absolute";
  element.style.left = `${position.x}px`;
  element.style.top = `${position.y}px`;
  element.style.width = `${size.width}px`;
  element.style.height = `${size.height}px`;

  //
  // --- BORDER ---
  //
  element.style.borderStyle = "solid";
  element.style.borderWidth = `${border.width}px`;
  element.style.borderColor = border.color;
  element.style.borderRadius = `${border.radius}px`;

  //
  // --- COLORS ---
  //
  element.style.backgroundColor = colors.bg;
  element.style.color = colors.text;

  //
  // --- TEXT STYLE ---
  //
  element.style.textAlign = text.align;
  element.style.fontSize = `${text.size}px`;
  element.style.fontFamily = text.font;

  //
  // --- CUSTOM CLASSES ---
  //
  if (classNames) {
    const classes = classNames.split(" ").filter(Boolean);
    element.classList.add(...classes);
  }

  //
  // --- CUSTOM CSS ---
  //
  Object.assign(element.style, css);

  //
  // --- READ ONLY ---
  //
  if (readOnly) {
    element.style.userSelect = "none";
    element.style.pointerEvents = "none";
    element.style.setProperty("cursor", "default", "important");
    element.style.overflow = "hidden"; // Prevent scrolling
  }

  // All elements clickable unless overridden
  element.style.pointerEvents = "auto";

  //
  // --- TYPE-SPECIFIC BEHAVIOR ---
  //

  // BUTTON
  if (type === "Button") {
    element.style.cursor = "pointer";

    const img = document.createElement("img");
    img.id = `${id}-img`;

    img.src = imageUrl ? imageUrl : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    // Filter img-classes
    const filtered = classNames.split(" ").filter((c) => c.startsWith("img-"));
    if (filtered.length) img.classList.add(...filtered);

    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = `${border.radius}px`;

    element.appendChild(img);

    if (text.content) {
      element.textContent = text.content;
    }
  }

  // IMAGE
  else if (type === "Image") {
    if (imageUrl) {
      element.src = imageUrl;
      element.style.width = "100%";
      element.style.height = "100%";
      element.style.objectFit = "fill";
    }
  }

  // TEXTAREA
  else if (type === "TextArea") {
    element.value = text.content;

    element.style.outline = "none";
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";

    if (readOnly) {
      element.style.userSelect = "none";
      element.style.pointerEvents = "none";
      element.style.setProperty("cursor", "default", "important");
      element.style.overflow = "hidden"; // Prevent scrolling
    } else {
      element.style.cursor = "text";
    }
  }

  // INPUT
  else if (type === "Input") {
    element.placeholder = text.content;
    element.style.cursor = readOnly ? "default" : "text";
  }

  // OTHER TYPES
  else {
    element.style.cursor = "default";
  }

  //
  // --- MOUNT ---
  //
  const container = document.getElementById("bema-container");
  if (container) {
    container.appendChild(element);
  } else {
    console.error("bema-container not found");
  }
}

/**
 * Attaches an event listener to an element.
 *
 * @param {string} id - The ID of the element to attach the event to, or `"document"` for the full screen.
 * @param {string} event - The event type to listen for (e.g. `"click"`, `"keydown"`, `"input"`).
 * @param {(e: Event) => void} callback - The function to call when the event is triggered.
 *
 * @example
 * onEvent('myButton', 'click', (e) => {
 *   console.log('Button clicked!', e);
 * });
 *
 * @example
 * onEvent('document', 'keydown', (e) => {
 *   console.log('Key pressed:', e.key);
 * });
 */
function onEvent(id, event, callback) {
  let target = id === "document" ? document : document.getElementById(id);

  if (target) {
    target.addEventListener(event, (e) => callback(e));
  } else {
    console.warn(`Element with id '${id}' not found. Event '${event}' not attached.`);
  }
}

/**
 * Simulates a user click on an element by dispatching a `MouseEvent`.
 *
 * @param {string} elementId - The ID of the target element to simulate a click on.
 *
 * @example
 * // Simulates a click on a button with ID "myButton"
 * simulateClick('myButton');
 *
 * @example
 * // Logs an error if the element doesn't exist
 * simulateClick('nonexistentId');
 */
function simulateClick(elementId) {
  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  const element = document.getElementById(elementId);
  if (element) {
    element.dispatchEvent(event);
  } else {
    console.error(`Element with ID "${elementId}" not found.`);
  }
}

/**
 * Sets the text content or value of an element by its ID.
 *
 * @param {string} elementId - The ID of the target element.
 * @param {string} text - The text to set inside the element.
 *
 * @example
 * setText('username', 'Guest');
 */
function setText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
      element.value = text;
    } else {
      element.innerText = text;
    }
  } else {
    console.log(`Element not found: ${elementId}`);
  }
}

/**
 * Gets the text content or value of an element by its ID.
 *
 * @param {string} elementId - The ID of the element to read text from.
 * @returns {string} The current text or value of the element, or an empty string if not found.
 *
 * @example
 * const username = getText('username');
 */
function getText(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      return element.value;
    } else {
      return element.innerText || element.textContent;
    }
  }
  return "";
}

/**
 * Deletes an element by its ID.
 *
 * @param {string} elementId - The ID of the element to remove.
 *
 * @example
 * deleteElement('myUglyButton');
 */
function deleteElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.remove();
  }
}

/**
 * Sets a CSS property or an image source on an element.
 *
 * @param {string} elementId - The ID of the target element.
 * @param {string} property - The property to set. Use `"image"` to set an image src.
 * @param {string} value - The value to assign to the property or image.
 *
 * @example
 * // Set background color
 * setProperty('myButton', 'background-color', 'red');
 *
 * @example
 * // Set button image
 * setProperty('myButton', 'image', 'image.png');
 */
function setProperty(elementId, property, value) {
  const element = document.getElementById(elementId);
  if (element) {
    if (property === "image") {
      const imgElement = element.tagName === "BUTTON" ? element.querySelector("img") : element;
      if (imgElement) {
        imgElement.src = value;
      }
    } else {
      element.style.setProperty(property, value);
    }
  }
}

/**
 * Gets a CSS property or image source from a element.
 *
 * @param {string} elementId - The ID of the element to query.
 * @param {string} property - The property to get. Use `"image"` to get an image src.
 * @returns {string|undefined} The current value of the property, or `undefined` if not found.
 *
 * @example
 * const bgColor = getProperty('myButton', 'background-color');
 *
 * @example
 * const imgSrc = getProperty('myButton', 'image');
 */
function getProperty(elementId, property) {
  const element = document.getElementById(elementId);
  if (element) {
    if (property === "image") {
      return element.tagName === "BUTTON" ? element.src + "-img" : element.src;
    } else {
      return element.style.getPropertyValue(property);
    }
  }
}

/**
 * Shows an element.
 * @param {string} elementId - The ID of the element to show.
 */
function showElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = "block";
  }
}

/**
 * Hides an element.
 * @param {string} elementId - The ID of the element to hide.
 */
function hideElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = "none";
  }
}

/**
 * Sets the position of an element.
 *
 * @param {string} elementId - The ID of the element to position.
 * @param {number} x - The horizontal position in pixels.
 * @param {number} y - The vertical position in pixels.
 *
 * @example
 * setPosition('myButton', 100, 200);
 */
function setPosition(elementId, x, y) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id '${elementId}' not found in setPosition.`);
    return;
  }
  x = isNaN(x) ? 0 : x;
  y = isNaN(y) ? 0 : y;
  element.style.position = "absolute";
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
}

/**
 * Gets the X (horizontal) position of an element.
 *
 * @param {string} elementId - The ID of the element.
 * @returns {number} The X position in pixels, or 0 if the element is not found.
 *
 * @example
 * const x = getXPosition('myButton');
 */
function getXPosition(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id '${elementId}' not found in getXPosition.`);
    return 0;
  }
  const rect = element.getBoundingClientRect();
  return rect.left;
}

/**
 * Gets the Y (vertical) position of an element.
 *
 * @param {string} elementId - The ID of the element.
 * @returns {number} The Y position in pixels, or 0 if the element is not found.
 *
 * @example
 * const y = getYPosition('myButton');
 */
function getYPosition(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id '${elementId}' not found in getYPosition.`);
    return 0;
  }
  const rect = element.getBoundingClientRect();
  return rect.top;
}

/**
 * Sets the width and height of an element.
 *
 * @param {string} elementId - The ID of the element to resize.
 * @param {number} width - The width in pixels.
 * @param {number} height - The height in pixels.
 *
 * @example
 * setSize('myButton', 200, 150);
 */
function setSize(elementId, width, height) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
  } else {
    console.warn(`Element with id '${elementId}' not found.`);
  }
}
