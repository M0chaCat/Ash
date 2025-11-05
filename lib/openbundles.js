// javascript-obfuscator:disable
var IDstarter = "Helion";
var HomescreenWindow = "";
var BarIconID = ".Home.DockApp.";

//Configure OpenBundles, all are REQUIRED
//IDstarter is like "Solstice"
//HomescreenWindow is like ".Homescreen.Window"
//BarIconID is like ".Homescreen.icon."
function openBundles$Config(IDstarterr, HomescreenWindoww, BarIconIDd) {
  IDstarter = IDstarterr;
  HomescreenWindow = HomescreenWindoww;
  BarIconID = BarIconIDd;
}

//Returns IDstarter
function openBundles$getIDstarter() {
  return IDstarter;
}

//Install a Shortcut
function openBundles$InstallShortcut(appname, iconn) {
  var icon;
  icon = iconn;
  if (barIcons.indexOf("") !== -1) {
    barIcons[barIcons.indexOf("")] = appname;
    setProperty(IDstarter + BarIconID + (barIcons.indexOf("") + 0) + "-img", "image", icon);
    showElement(IDstarter + BarIconID + (barIcons.indexOf("") + 0));
    return barIcons.indexOf(appname);
  }
  return false;
}

//Uninstall a Shortcut
function openBundles$UninstallShortcut(appname) {
  for (var i = 0; i < barIcons.length; i++) {
    if (barIcons[i] === appname) {
      barIcons[i] = "";
      setProperty(IDstarter + BarIconID + (i + 1), "image", "assets/question.png");
      hideElement(IDstarter + BarIconID + (i + 1));
      return;
    }
  }
}

// Function to return all AppBundleIDs
function openBundles$displayLinks() {
  for (var key in Apps) {
    if (Apps.hasOwnProperty(key)) {
      console.log(key + " : " + Apps[key]);
    }
  }
}

// Function to register a AppBundle
function openBundles$RegisterAppBundle(BundleID, Screens) {
  //Apps[BundleID] = Screens;
}

// Hide all icons, use when opening an app bundle
function openBundles$hideIcons() {
  showElement(IDstarter + HomescreenWindow);
}

// Show all icons, use when closing an app bundle
function openBundles$showIcons() {
  hideElement(IDstarter + HomescreenWindow);
}

var apps = [];
// Function to add an app to the end of the list
function openBundles$addApp(name, version, author, mainscreen, icon, isbundle, showinappstore) {
  apps.push({
    name: name,
    version: version,
    author: author,
    mainscreen: mainscreen,
    icon: icon,
    isbundle: isbundle,
    showinappstore: showinappstore,
  });
}

function openBundles$removeApp(name) {
  const index = apps.findIndex((app) => app.name === name);
  if (index !== -1) {
    apps.splice(index, 1);
    return true; // removed successfully
  }
  return false; // app not found
}

// Function to return apps
function openBundles$getApps() {
  return apps;
}

Object.defineProperty(window, "OpenBundles$RegisterAppBundle", {
  value: function (BundleID, Screens) {
    Apps[BundleID] = Screens;
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(window, "OpenBundles$hideIcons", {
  value: function () {
    HomeScreen(false);
    //showElement(IDstarter + HomescreenWindow);
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(window, "OpenBundles$showIcons", {
  value: function () {
    HomeScreen(true);
    Heilos$ReSetIconImages();
    //hideElement(IDstarter + HomescreenWindow);
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(window, "OpenBundles$getApps", {
  value: function () {
    return apps;
  },
  writable: false,
  configurable: false,
});

Object.defineProperty(window, "OpenBundles$openApp", {
  value: function (appName) {
    var TempApps = OpenBundles$getApps();
    for (var i = 0; i < TempApps.length; i++) {
      var app = TempApps[i];
      if (app.name === appName) {
        if (app.isbundle === true) {
          if (app.mainscreen.indexOf("Bundle$") !== -1) {
            eval(app.mainscreen);
          } else {
            console.log("[OpenBundles]: The app might not be a bundle!");
          }
        } else {
          console.error("[OpenBundles]: App is for applab only!");
        }
        return;
      }
    }
    console.error("App with name " + appName + " not found.");
  },
  writable: false,
  configurable: false,
});

var activeBundles = {};

// javascript-obfuscator:enable
