// ============================================================================
// FEEDBACK TRANSLATIONS
// ============================================================================

export const FEEDBACK_TRANSLATIONS = {
  de: {
    // Login
    loginSuccess: "Anmeldung erfolgreich!",
    loginSuccessMessage: "Du wirst zum Dashboard weitergeleitet...",
    loginError: "Anmeldung fehlgeschlagen",
    loginErrorInvalid: "E-Mail oder Passwort ist ungültig.",
    
    // Logout
    logoutSuccess: "Abmeldung erfolgreich",
    logoutMessage: "Du wirst zur Startseite weitergeleitet...",
    
    // Upload
    uploadSuccess: "Datei erfolgreich hochgeladen!",
    uploadSuccessMessage: "Deine Abgabe wurde eingereicht.",
    uploadError: "Upload fehlgeschlagen",
    uploadErrorMessage: "Bitte versuche es erneut.",
    uploadValidationError: "Bitte fülle alle Pflichtfelder aus.",
    uploadMissingFile: "Bitte wähle eine Datei aus.",
    uploadMissingAgreement: "Bitte akzeptiere die erforderlichen Erklärungen.",
    
    // Reports / Praxisbericht
    reportSaved: "Bericht gespeichert",
    reportSavedMessage: "Dein Wochenbericht wurde als Entwurf gespeichert.",
    reportSubmitted: "Bericht eingereicht!",
    reportSubmittedMessage: "Dein Wochenbericht wurde erfolgreich übermittelt.",
    reportError: "Speichern fehlgeschlagen",
    reportErrorMessage: "Bitte versuche es erneut.",
    reportValidationError: "Bitte gib mindestens 10 Zeichen für die Aufgaben ein.",
    
    // Grades / Transcript
    gradesLoaded: "Noten geladen",
    gradesLoadedMessage: "Deine aktuellen Noten wurden erfolgreich abgerufen.",
    gradesError: "Fehler beim Laden der Noten",
    gradesErrorMessage: "Bitte versuche es später erneut.",
    transcriptDownloading: "PDF wird erstellt...",
    transcriptDownloadSuccess: "Notenspiegel heruntergeladen!",
    transcriptDownloadSuccessMessage: "Das PDF wurde erfolgreich erstellt.",
    transcriptDownloadError: "Download fehlgeschlagen",
    
    // Settings
    settingsSaved: "Einstellungen gespeichert!",
    settingsSavedMessage: "Deine Änderungen wurden übernommen.",
    settingsError: "Speichern fehlgeschlagen",
    reminderActive: "Erinnerung aktiviert",
    reminderActiveMessage: (time: string) => `Du erhältst täglich um ${time} Uhr eine Erinnerung.`,
    reminderDisabled: "Erinnerung deaktiviert",
    reminderDisabledMessage: "Du erhältst keine täglichen Erinnerungen mehr.",
    
    // Contact Form
    contactSent: "Nachricht gesendet!",
    contactSentMessage: "Wir melden uns schnellstmöglich bei dir.",
    contactError: "Senden fehlgeschlagen",
    contactErrorMessage: "Bitte versuche es erneut.",
    
    // Student ID
    studentIdDownloading: "Ausweis wird erstellt...",
    studentIdDownloadSuccess: "Studierendenausweis heruntergeladen!",
    studentIdDownloadError: "Download fehlgeschlagen",
    
    // Forum
    forumTopicCreated: "Thema erstellt!",
    forumTopicCreatedMessage: "Dein Beitrag wurde veröffentlicht.",
    forumReplyPosted: "Antwort gepostet!",
    forumError: "Aktion fehlgeschlagen",
    
    // General
    loading: "Wird geladen...",
    saving: "Wird gespeichert...",
    success: "Erfolgreich!",
    error: "Ein Fehler ist aufgetreten",
    tryAgain: "Bitte versuche es erneut.",
    copied: "In Zwischenablage kopiert!",
  },
  
  en: {
    // Login
    loginSuccess: "Login successful!",
    loginSuccessMessage: "Redirecting to dashboard...",
    loginError: "Login failed",
    loginErrorInvalid: "Invalid email or password.",
    
    // Logout
    logoutSuccess: "Logged out successfully",
    logoutMessage: "Redirecting to home page...",
    
    // Upload
    uploadSuccess: "File uploaded successfully!",
    uploadSuccessMessage: "Your submission has been received.",
    uploadError: "Upload failed",
    uploadErrorMessage: "Please try again.",
    uploadValidationError: "Please fill in all required fields.",
    uploadMissingFile: "Please select a file.",
    uploadMissingAgreement: "Please accept the required statements.",
    
    // Reports / Praxisbericht
    reportSaved: "Report saved",
    reportSavedMessage: "Your weekly report was saved as a draft.",
    reportSubmitted: "Report submitted!",
    reportSubmittedMessage: "Your weekly report has been successfully submitted.",
    reportError: "Save failed",
    reportErrorMessage: "Please try again.",
    reportValidationError: "Please enter at least 10 characters for tasks.",
    
    // Grades / Transcript
    gradesLoaded: "Grades loaded",
    gradesLoadedMessage: "Your current grades have been successfully retrieved.",
    gradesError: "Error loading grades",
    gradesErrorMessage: "Please try again later.",
    transcriptDownloading: "Creating PDF...",
    transcriptDownloadSuccess: "Transcript downloaded!",
    transcriptDownloadSuccessMessage: "The PDF was created successfully.",
    transcriptDownloadError: "Download failed",
    
    // Settings
    settingsSaved: "Settings saved!",
    settingsSavedMessage: "Your changes have been applied.",
    settingsError: "Save failed",
    reminderActive: "Reminder activated",
    reminderActiveMessage: (time: string) => `You will receive a daily reminder at ${time}.`,
    reminderDisabled: "Reminder disabled",
    reminderDisabledMessage: "You will no longer receive daily reminders.",
    
    // Contact Form
    contactSent: "Message sent!",
    contactSentMessage: "We'll get back to you as soon as possible.",
    contactError: "Send failed",
    contactErrorMessage: "Please try again.",
    
    // Student ID
    studentIdDownloading: "Creating ID card...",
    studentIdDownloadSuccess: "Student ID downloaded!",
    studentIdDownloadError: "Download failed",
    
    // Forum
    forumTopicCreated: "Topic created!",
    forumTopicCreatedMessage: "Your post has been published.",
    forumReplyPosted: "Reply posted!",
    forumError: "Action failed",
    
    // General
    loading: "Loading...",
    saving: "Saving...",
    success: "Success!",
    error: "An error occurred",
    tryAgain: "Please try again.",
    copied: "Copied to clipboard!",
  },
};

export type FeedbackTranslations = typeof FEEDBACK_TRANSLATIONS.de;
