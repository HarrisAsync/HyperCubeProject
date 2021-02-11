const VIEW_HISTORY_KEY = "View history";

let raw_history = localStorage.getItem(VIEW_HISTORY_KEY);
let history;
if (raw_history == null) {
    history = {};
} else {
    history = JSON.parse(raw_history);
}

history[window.location.pathname] = true;

//localStorage.setItem(VIEW_HISTORY_KEY, JSON.stringify(history));