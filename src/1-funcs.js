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
		Helion$ReSetIconImages();
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
        if (sessionOwner == users[0]) {
            return false;
        }
		var TempApps = OpenBundles$getApps();
		for (var i = 0; i < TempApps.length; i++) {
			var app = TempApps[i];
			if (app.name === appName) {
				if (app.isbundle === true) {
					if (app.mainscreen.indexOf("Bundle$") !== -1) {
						eval(app.mainscreen);
					} else {
						console.log("The mainscreen does not contain the expected keyword.");
					}
				} else {
					setScreen(app.mainscreen);
				}
				return;
			}
		}
		console.log("App with name " + appName + " not found.");
	},
	writable: false,
	configurable: false,
});

Object.defineProperty(window, "Equinox$InstallApp", {
	value: function (appname) {
		if (icons.indexOf("") !== -1) {
			var index = icons.indexOf("");
			icons[index] = appname;

			var appsArray = OpenBundles$getApps();
			var appIcon = "";
			for (var i = 0; i < appsArray.length; i++) {
				if (appsArray[i].name === appname) {
					appIcon = appsArray[i].icon;
					break; // Found the app, exit loop
				}
			}

			setProperty("Equinox.Home.App." + index, "image", appIcon); // Use icon from apps array
			showElement("Equinox.Home.App." + index);
			updateIconVisibility();
			return true;
		}
		return false;
	},
	writable: false,
	configurable: false,
});

Object.defineProperty(window, "Equinox$UninstallApp", {
	value: function (appname) {
		for (var i = 0; i < icons.length; i++) {
			if (icons[i] === appname) {
				icons[i] = "";
				setProperty("Equinox.Home.App." + (i + 1), "image", "icon://fa-question");
				hideElement("Equinox.Home.App." + (i + 1));
				updateIconVisibility();
				return;
			}
		}
		//FW.WriteError("Can't find app", "Homescreenmgr");
	},
	writable: false,
	configurable: false,
});

function UninstallAllApps() {
    for (var i = 0; i < icons.length; i++) {
        if (icons[i] !== "") {
            Equinox$UninstallApp(icons[i]);
        }
    }
}

async function DownloadFunction(url) {
	if (isNyaNetAvailable) {
		const res = await fetch(url);
		const code = await res.text();
		//console.log("Got code:\n", code);
		eval(code);
	}
}