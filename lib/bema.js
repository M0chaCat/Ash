/**
 * Creates and configures a UI element on the screen.
 *
 * @param {string} type - The HTML element type to create (e.g. `"div"`, `"button"`, `"input"`).
 * @param {string} id - The unique ID to assign to the element.
 * @param {number} x - The horizontal position (in pixels) on the screen.
 * @param {number} y - The vertical position (in pixels) on the screen.
 * @param {number|string} width - The element width (in pixels or CSS units).
 * @param {number|string} height - The element height (in pixels or CSS units).
 * @param {boolean} [autohide=false] - Whether the element should automatically be hidden.
 * @param {number} [rounded=15] - Rounded corners in px.
 * @param {number|string} [borderWidth=0] - The width of the border.
 * @param {string} [borderColor="#000"] - The border color.
 * @param {string} [bgColor="transparent"] - The background color.
 * @param {string} [textColor="#000"] - The text color.
 * @param {string} [text=""] - The text content of the element.
 * @param {"left"|"center"|"right"} [textAlign="left"] - Text alignment within the element.
 * @param {number|string} [fontSize="1em"] - Font size for the text in px.
 * @param {string} [fontFamily="sans-serif"] - Font family for the text.
 * @param {boolean} [readOnly=false] - If true, makes inputs non-editable.
 * @param {string} [icon] - Optional image URL, only applies to `image` and `button` types.
 * @param {string} [iconColor="#000"] - Unused variable, will have future purpose.
 * @param {string} [customClass] - Additional CSS class to apply to the element.
 * @param {Object} [customCSS] - Inline CSS (key–value object) to apply directly.
 *
 * @example
 * BEMA('button', 'confirmBtn', 100, 200, 120, 40, false, 15, 2, '#333', '#222', '#fff', 'Confirm', 'center', '16px', 'Arial', false, 'check', '#0f0', 'btn-confirm', {boxShadow: '0 2px 6px rgba(0,0,0,0.3)'});
 */
function BEMA(type, id, x, y, width, height, autohide, rounded, borderWidth, borderColor, bgColor, textColor, text, textAlign, fontSize, fontFamily, readOnly, icon, iconColor, customClass, customCSS) {
  let element;

  if (type === "Button") {
    element = document.createElement("button");
  } else if (type === "Image") {
    element = document.createElement("img");
    if (icon) {
      element.src = icon;
      element.style.width = "100%";
      element.style.height = "100%";
      element.style.objectFit = "fill";
    }
  } else if (type === "Input") {
    element = document.createElement("input");
    element.type = "text"; // Set the input type to 'text'
  } else {
    element = document.createElement(type);
  }

  element.id = id;
  element.style.position = "absolute";
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.borderStyle = "solid";
  element.style.borderWidth = `${borderWidth}px`;
  element.style.borderColor = borderColor;
  element.style.backgroundColor = bgColor;
  element.style.color = textColor;
  element.style.textAlign = textAlign;
  element.style.fontSize = `${fontSize}px`;
  element.style.fontFamily = fontFamily;
  element.style.borderRadius = `${rounded}px`;

  // Apply custom class(es) if provided
  if (customClass) {
    const classes = customClass.split(" ");
    element.classList.add(...classes);
  }

  // Apply custom CSS if provided
  if (customCSS) {
    Object.assign(element.style, customCSS);
  }

  if (readOnly) {
    element.readOnly = true;
    element.style.userSelect = "none";
    element.style.pointerEvents = "none";
  }

  // Make all elements clickable
  element.style.pointerEvents = "auto";

  if (type === "Button") {
    element.style.cursor = "pointer";
    const img = document.createElement("img");
    img.id = id + "-img"; // Assign an ID to the img element
    if (!icon) {
      // Only set image if icon exists, otherwise use 1x1 transparent placeholder
      img.src = icon
        ? icon // your actual icon path
        : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    } else {
      img.src = icon; // Set the src to icon if it's not falsy
    }
    // Apply custom class to image if provided
    if (customClass) {
      const filteredClasses = customClass.split(" ").filter((c) => c.startsWith("img-"));
      if (filteredClasses.length) {
        img.classList.add(...filteredClasses);
      }
    }
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = `${rounded}px`;
    element.appendChild(img);
    if (text) {
      element.textContent = text;
    }
  } else if (type === "TextArea") {
    element.value = text;
    element.style.outline = "none";
    element.style.display = "flex";
    element.style.alignItems = "center"; // Vertically center the text
    element.style.justifyContent = "center"; // Horizontally center the text
    element.style.height = `${height}px`; // Ensure height is set for centering
    if (readOnly) {
      element.style.userSelect = "none";
      element.style.pointerEvents = "none";
      element.style.setProperty("cursor", "default", "important");
      element.style.overflow = "hidden"; // Prevent scrolling
    } else {
      element.style.cursor = "text";
    }
  } else if (type === "Input") {
    element.placeholder = text; // Set placeholder instead of value for Input
  } else if (type === "Image" && icon) {
    element.src = icon;
  } else {
    element.style.cursor = "default"; // Ensure non-button elements have the default cursor
  }

  if (autohide) {
    element.style.display = "none";
  }

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
 * setProperty('myButton', 'image', 'icon.png');
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
