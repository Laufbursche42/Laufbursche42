'use strict';

// All visible page texts in both languages. The keys match the data-t attributes
// in index.html. German is the default; the switch sits in the header.
window.I18N = {
  de: {
    pageTitle: "Laufbursche42",
    metaDesc: "Laufbursche42 - E-Scooter Tools und Projekte auf GitHub.",
    themeToLight: "Auf helle Darstellung umschalten",
    themeToDark: "Auf dunkle Darstellung umschalten",

    reposTitle: "Öffentliche Repositories",
    reposLoading: "Repositories werden geladen ...",
    reposError: "Die Liste konnte nicht von GitHub geladen werden. Direkt auf GitHub ansehen.",
    reposAll: "Alle Repositories auf GitHub ansehen",
    reposSearch: "Repos filtern (z. B. Herstellername) ...",
    reposNoMatch: "Keine Repos passen zur Suche.",

    aboutTitle: "Über mich",
    aboutIntro: "Hi, ich bin Laufbursche42. Ich schraube an E-Scootern und baue Werkzeuge, mit denen sich Fahrzeuge verschiedener Hersteller auslesen, konfigurieren und entsperren lassen.",

    doTitle: "Womit ich mich beschäftige",
    do1t: "Web-Apps",
    do1d: "direkt im Browser über Web Bluetooth.",
    do2t: "Firmware-Patches",
    do2d: "angepasste Firmware für einzelne Modelle.",
    do3t: "Android-App",
    do3d: "eine eigene Alternative zur Hersteller-Software.",
    do4t: "App-Analyse",
    do4d: "Hersteller-Apps auf Datensammlung, Tracker und Datenschutz prüfen.",

    brandsTitle: "Marken, mit denen ich mich befasse",
    brandsMore: "und mehr",

    privacyTitle: "Datensparsamkeit",
    privacyText: "Mein Anspruch ist es, Apps und Web-Apps zu bauen, die so wenig Daten wie irgend möglich nach außen senden. Datensparsamkeit steht bei jedem Projekt an erster Stelle: kein Konto, keine Analyse, keine Telemetrie, kein Tracking. Wo eine Verbindung nötig ist, etwa für öffentliche Karten- oder Routing-Daten, geschieht das nur auf deine ausdrückliche Aktion. Fahrzeug- oder persönliche Daten werden dabei nie übertragen.",

    aiTitle: "Einsatz von LLMs",
    aiP1: "In diesen Projekten werden LLMs (Sprachmodelle) eingesetzt. Das lege ich hier offen. Sie helfen beim Erarbeiten von Inhalten, beim Erstellen von Programmcode und beim Prüfen der Ergebnisse. Wichtige Ergebnisse werden dabei von mehreren Modellen gegengeprüft. Alles, was hier veröffentlicht wird, kann daher zumindest teilweise mit ihrer Unterstützung entstanden sein.",
    aiP2: "Ganz genau zu benennen, an welcher Stelle ein Modell mitgewirkt hat und wo nicht, ist in der Praxis nicht immer möglich. Modell und menschliche Arbeit greifen eng ineinander - Ideen, Formulierungen, Codeteile und Bewertungen entstehen oft im Wechselspiel.",
    aiP3: "Die Verantwortung bleibt beim Menschen. Fragestellung, Richtung, fachliche Einordnung und die abschließende Entscheidung liegen bei mir. LLMs sind ein Werkzeug, das die Arbeit beschleunigt, sie aber nicht ersetzt.",

    contactTitle: "Bugs / Fragen",
    contactText: "Du hast eine Idee, einen Wunsch oder bist über einen Fehler gestolpert? Ich freue mich über jede Rückmeldung. Schreib mir einfach im escooter-stammtisch oder öffne ein GitHub-Issue im passenden Repository.",
    issueNew: "Fehler melden",
    issueNewTitle: "Fehler in diesem Repository melden (neues GitHub-Issue)",
    pagesLink: "Website",
    pagesTitle: "Projektseite öffnen",
    dlApk: "APK",
    dlApkTitle: "Neueste APK herunterladen",
    dlWin: "Windows",
    dlWinTitle: "Neueste Windows-Version herunterladen",
    dlMac: "macOS",
    dlMacTitle: "Neueste macOS-Version herunterladen",
    dlLinux: "Linux",
    dlLinuxTitle: "Neueste Linux-Version herunterladen",

    linksTitle: "Links"
  },

  en: {
    pageTitle: "Laufbursche42",
    metaDesc: "Laufbursche42 - e-scooter tools and projects on GitHub.",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",

    reposTitle: "Public repositories",
    reposLoading: "Loading repositories ...",
    reposError: "The list could not be loaded from GitHub. View it directly on GitHub.",
    reposAll: "See all repositories on GitHub",
    reposSearch: "Filter repos (e.g. manufacturer) ...",
    reposNoMatch: "No repos match your search.",

    aboutTitle: "About me",
    aboutIntro: "Hi, I am Laufbursche42. I tinker with e-scooters and build tools that read out, configure and unlock vehicles from various manufacturers.",

    doTitle: "What I work on",
    do1t: "Web apps",
    do1d: "right in the browser over Web Bluetooth.",
    do2t: "Firmware patches",
    do2d: "tailored firmware for individual models.",
    do3t: "Android app",
    do3d: "my own alternative to the manufacturer software.",
    do4t: "App analysis",
    do4d: "checking manufacturer apps for data collection, trackers and privacy.",

    brandsTitle: "Brands I tinker with",
    brandsMore: "and more",

    privacyTitle: "Data minimalism",
    privacyText: "My aim is to build apps and web apps that send as little data as possible anywhere. Data minimalism comes first in every project: no account, no analytics, no telemetry, no tracking. Where a connection is needed, for example for public map or routing data, it happens only on your explicit action. No vehicle or personal data is ever transmitted.",

    aiTitle: "Use of LLMs",
    aiP1: "These projects make use of LLMs (language models). I disclose that openly here. They help with drafting content, writing program code and checking the results. Important results are cross-checked by several models. Anything published here may therefore have been created at least in part with their help.",
    aiP2: "Pinpointing exactly where a model contributed and where it did not is not always possible in practice. Model and human work are closely intertwined - ideas, wording, pieces of code and assessments often emerge in the interplay.",
    aiP3: "Responsibility stays with the human. The questions asked, the direction, the technical judgement and the final decision rest with me. LLMs are a tool that speeds the work up but does not replace it.",

    contactTitle: "Bugs / Questions",
    contactText: "Got an idea, a wish or ran into a bug? I am happy about every bit of feedback. Just message me on escooter-stammtisch or open a GitHub issue in the matching repository.",
    issueNew: "Bug Report",
    issueNewTitle: "Report a bug in this repository (new GitHub issue)",
    pagesLink: "Website",
    pagesTitle: "Open project website",
    dlApk: "APK",
    dlApkTitle: "Download latest APK",
    dlWin: "Windows",
    dlWinTitle: "Download latest Windows build",
    dlMac: "macOS",
    dlMacTitle: "Download latest macOS build",
    dlLinux: "Linux",
    dlLinuxTitle: "Download latest Linux build",

    linksTitle: "Links"
  }
};

