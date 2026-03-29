import { precacheAndRoute } from 'workbox-precaching';

// 1. Esto permite a VitePWA inyectar automáticamente todo el código cacheable (HTML, JS, CSS)
// Nunca quites ni renombrees self.__WB_MANIFEST
precacheAndRoute(self.__WB_MANIFEST);

// 2. Interceptar el evento 'push' desde el servidor (Push Notifications)
self.addEventListener('push', (event) => {
    // Definir valores por defecto por si llega un payload vacío
    let data = { title: "Bitobbu", body: "Tienes una nueva notificación", url: "/" };

    if (event.data) {
        try {
            data = { ...data, ...event.data.json() };
        } catch (e) {
            // Si no es JSON válido, tomar como texto plano
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/vite.svg', // Icono que aparece al lado de la notificación
        badge: '/vite.svg', // Icono pequeño monocromático para Android
        vibrate: [200, 100, 200], // Patrón de vibración
        data: {
            url: data.url // Guardamos la URL para abrirla cuando el usuario haga click
        }
    };

    // Mostrar notificación al usuario
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 3. Manejar lo que ocurre cuando el usuario hace "Click" o toca la notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Cerrar al instante

    // Intentar abrir la URL enviada en la notificación
    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Si ya hay una pestaña de la app abierta, enfocarse en ella y navegar
            const client = windowClients.find(c => c.url.includes(self.location.origin));
            if (client) {
                client.focus();
                // Opcional: client.navigate(urlToOpen)
                return;
            }
            // Si no hay ninguna pestaña abierta, abrir una nueva
            return clients.openWindow(urlToOpen);
        })
    );
});
