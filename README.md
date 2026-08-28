# MEL13 Premium — briefing de packaging

Landing de GAMO Agencia Creativa preparada para GitHub Pages. Incluye formulario, guardado local del borrador, previsualización y descarga del PDF y envío por email.

## Publicación

1. Crea en GitHub un repositorio vacío, por ejemplo `mel13-premium-briefing`.
2. Sube a la raíz del repositorio todo el contenido de esta carpeta.
3. En **Settings → Pages**, selecciona **GitHub Actions** como fuente de publicación.
4. Comprueba que la acción **Publicar en GitHub Pages** termina correctamente.
5. En **Settings → Pages → Custom domain**, indica `briefing-mel13.agenciagamo.es` y activa **Enforce HTTPS** cuando GitHub lo permita.

## DNS en Webempresa

Crea un registro CNAME:

- Nombre/host: `briefing-mel13`
- Destino: `<tu-usuario-de-github>.github.io`

Si GitHub solicita un TXT de verificación, copia exactamente el nombre y el valor que muestre en la configuración del dominio. No cambies los registros de la web principal ni del correo.

## Prueba antes del envío al cliente

1. Abre el formulario publicado.
2. Cumplimenta los campos obligatorios con datos de prueba.
3. Revisa la previsualización del PDF.
4. Realiza un envío a una dirección interna.
5. Verifica la recepción del PDF y las copias antes de compartir el enlace definitivo.

La primera entrega a `info@agenciagamo.es` puede activar la validación inicial de FormSubmit. Confirma ese mensaje si se recibe antes de hacer la prueba definitiva.

## Desarrollo local

```bash
npm install
npm run dev
```

Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```
