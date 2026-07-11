import WebApp from "@twa-dev/sdk";

export const tg = WebApp;

export function initTg() {
  try {
    WebApp.ready();
    WebApp.expand();
    WebApp.setHeaderColor("#17212B");
    WebApp.setBackgroundColor("#17212B");
  } catch {
    // running outside Telegram (browser dev mode)
  }
}

export function sendOrder(payload: object) {
  try {
    WebApp.sendData(JSON.stringify(payload));
  } catch {
    console.warn("sendData failed (outside Telegram?)");
  }
}

export function closeMiniApp() {
  try { WebApp.close(); } catch { }
}

export const tgUser = (() => {
  try { return WebApp.initDataUnsafe?.user; } catch { return null; }
})();
