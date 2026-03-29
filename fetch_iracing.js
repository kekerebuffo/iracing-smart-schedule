const puppeteer = require('puppeteer-core');
const fs = require('fs');
const fsPromises = require('fs').promises;

(async () => {
    try {
        console.log("Iniciando automatización...");
        const credsPath = 'C:\\Users\\keker\\Desktop\\iracing_creds.txt';
        if (!fs.existsSync(credsPath)) {
            console.log("No se encontró el archivo de credenciales en el escritorio.");
            return;
        }

        const lines = await fsPromises.readFile(credsPath, 'utf-8');
        const [email, password] = lines.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

        const executablePaths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
        ];
        let browserPath = executablePaths.find(p => fs.existsSync(p));
        if (!browserPath) throw new Error("No se encontró Google Chrome ni Microsoft Edge instalado en las rutas por defecto.");

        console.log(`Lanzando navegador: ${browserPath}`);
        const browser = await puppeteer.launch({
            executablePath: browserPath,
            headless: false, // Abre la ventana visiblemente
            defaultViewport: null
        });

        const page = await browser.newPage();
        console.log("Navegando a iRacing...");
        await page.goto('https://members-ng.iracing.com/', { waitUntil: 'networkidle2' });

        console.log("Esperando campos de login...");
        
        // iRacing usa Okta. El campo de email suele ser name="identifier" o similar.
        // Buscaremos cualquier input de tipo email o text visible.
        await page.waitForSelector('input[name="identifier"], input[type="email"], input[name="email"]', { timeout: 15000 }).catch(() => {});
        
        // Intentar llenar el email
        const emailInput = await page.$('input[name="identifier"]') || await page.$('input[type="email"]');
        if (emailInput) {
            await emailInput.type(email);
        } else {
            console.log("No se encontró el campo de email automáticamente. Por favor, llénalo a mano si es necesario.");
        }

        // Intentar llenar la contraseña
        const passInput = await page.$('input[name="credentials.passcode"]') || await page.$('input[type="password"]');
        if (passInput) {
            await passInput.type(password);
            
            // Hacer clic en login (Okta submit)
            const submitBtn = await page.$('input[type="submit"]') || await page.$('button[type="submit"]');
            if (submitBtn) {
                console.log("Haciendo clic en Iniciar Sesión...");
                await submitBtn.click();
            }
        }

        console.log("Esperando a que termine de iniciar sesión (y por si hay un Captcha)...");
        console.log("=> ¡Si ves un Captcha en la ventana del navegador, resuélvelo manualmente ahora! <=");
        
        // Esperamos hasta que aparezca el elemento principal del UI o pasen 60 segundos
        await page.waitForFunction(() => {
            return window.location.href.includes('members-ng.iracing.com') && 
                   !window.location.href.includes('/auth') &&
                   document.querySelector('.sidebar') || document.querySelector('.navbar');
        }, { timeout: 60000 }).catch(() => console.log("Timeout de 60s esperando el dashboard. Continuaremos de todos modos."));

        console.log("¡Sesión iniciada! Obteniendo enlaces de datos de la API...");
        await new Promise(r => setTimeout(r, 3000));

        const dataUrls = await page.evaluate(async () => {
            async function fetchLink(url) {
                try {
                    const res = await fetch(url);
                    if (!res.ok) return "ERR: " + res.status;
                    const data = await res.json();
                    return data.link;
                } catch (e) {
                    return "ERR: " + e.message;
                }
            }
            
            return {
                cars: await fetchLink('https://members-ng.iracing.com/data/car/get'),
                tracks: await fetchLink('https://members-ng.iracing.com/data/track/get'),
                seasons: await fetchLink('https://members-ng.iracing.com/data/series/seasons')
            };
        });

        console.log("Enlaces obtenidos:", dataUrls);

        for (const [key, url] of Object.entries(dataUrls)) {
            if (!url || typeof url !== 'string' || url.startsWith('ERR')) {
                console.log(`Falló la carga de ${key}: ${url}`);
                continue;
            }
            console.log(`Descargando datos masivos de ${key}...`);
            const res = await fetch(url);
            const text = await res.text();
            
            const outPath = `C:\\Users\\keker\\.gemini\\antigravity\\scratch\\iracing-smart-schedule\\public\\${key}.json`;
            await fsPromises.writeFile(outPath, text);
            console.log(`>>> Guardado exitosamente: ${outPath}`);
        }

        console.log("-----------------------------------------");
        console.log("¡Todo listo! Cerrando el navegador secreto.");
        await browser.close();

    } catch (err) {
        console.error("Hubo un error en el script:");
        console.error(err);
    }
})();
