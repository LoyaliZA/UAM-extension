const API_URL = "http://192.168.1.66:8080/api/logs"; 
const API_TOKEN = "1|rE39T75NzouA4yBwoQciQMSipYX9YDbSwY6aMLwTc2d3facb"; 
const EMPLOYEE_ID = "EMP-CHROME-01"; 

// 1. Monitoreo de Navegación
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
        enviarLogAlServidor({
            employee_identifier: EMPLOYEE_ID,
            event_type: "navigation",
            url_or_path: tab.url,
            window_title: tab.title || "Sin título",
            payload: { action: "page_loaded" }
        });
    }
});

// 2. Enrutador de Mensajes (Formularios, Teclado, Portapapeles)
chrome.runtime.onMessage.addListener((mensaje) => {
    let eventType = "";
    if (mensaje.tipo === "form_submit") eventType = "form_submit";
    if (mensaje.tipo === "keystroke_batch") eventType = "keystroke";
    if (mensaje.tipo === "clipboard_action") eventType = "clipboard";

    if (eventType) {
        enviarLogAlServidor({
            employee_identifier: EMPLOYEE_ID,
            event_type: eventType,
            url_or_path: mensaje.url,
            window_title: mensaje.titulo,
            payload: mensaje.datos 
        });
    }
});

async function enviarLogAlServidor(data) {
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${API_TOKEN}` 
            },
            body: JSON.stringify(data)
        });
    } catch (e) { console.error("Error de red UAM"); }
}