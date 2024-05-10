"use client";
if (typeof window !== "undefined") {
    // Keenthemes' plugins
    window.KTApp = require("./components/app.js");
    window.KTUtil = require("./components/util.js");
    window.KTDrawer = require("./components/drawer.js");
    window.KTEventHandler = require("./components/event-handler.js");
    window.KTBlockUI = require("./components/blockui.js");
    window.KTCookie = require("./components/cookie.js");
    window.KTDialer = require("./components/dialer.js");
    window.KTFeedback = require("./components/feedback.js");
    window.KTImageInput = require("./components/image-input.js");
    window.KTMenu = require("./components/menu.js");
    window.KTPasswordMeter = require("./components/password-meter.js");
    window.KTScroll = require("./components/scroll.js");
    window.KTScrolltop = require("./components/scrolltop.js");
    window.KTSearch = require("./components/search.js");
    window.KTStepper = require("./components/stepper.js");
    window.KTSticky = require("./components/sticky.js");
    window.KTSwapper = require("./components/swapper.js");
    window.KTToggle = require("./components/toggle.js");
    window.KTComponents = require("./components/_init.js");
    console.log(window.KTComponents);
    // Layout base js
    window.KTLayoutAside = require("./layout/aside.js");
    window.KTLayoutHeader = require("./layout/header.js");
    window.KTLayoutSearch = require("./layout/search.js");
    window.KTThemeMode = require("./layout/theme-mode.js");
    window.KTThemeModeUser = require("./layout/theme-mode-user.js");
}
