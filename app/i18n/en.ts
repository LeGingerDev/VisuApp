import demoEn from "./demo-en"

export const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
    done: "Done",
    search: "Search",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    submit: "Submit",
    continue: "Continue",
    next: "Next",
    previous: "Previous",
    show: "Show",
    hide: "Hide",
    confirm: "Confirm",
    dismiss: "Dismiss",
    yes: "Yes",
    no: "No",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },

  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    logIn: "Log In",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    tapToLogIn: "Tap to log in!",
    hint: "Hint: you can use any email address and your favorite password :)",
  },
  splashScreen: {
    title: "VisuApp",
    subtitle: "Loading...",
  },
  homeScreen: {
    title: "Welcome to VisuApp",
    subtitle: "You're successfully logged in!",
  },

  ...demoEn,
}

export default en
export type Translations = typeof en