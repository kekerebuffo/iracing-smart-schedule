const puppeteer = require('puppeteer-core');
const fs = require('fs');
const fsPromises = require('fs').promises;

(async () => {
    try {
        console.log("Iniciando automatización V2 (Interceptando Token)...");
        const credsPath = 'C:\\Users\\keker\\Desktop\\iracing_creds.txt';
        if (!fs.existsSync(credsPath)) {
            console.log("No se encontró el archivo de credenciales.");
            return;
        }

        const lines = await fsPromises.readFile(credsPath, 'utf-8');
        const [email, password] = lines.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

        const executablePaths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
        ];
        let browserPath = executablePaths.find(p => fs.existsSync(p));
        if (!browserPath) throw new Error("No browser found.");

        const browser = await puppeteer.launch({
            executablePath: browserPath,
            headless: false,
            defaultViewport: null
        });

        const page = await browser.newPage();
        
        let authToken = null;
        
        // Listen to all outgoing requests to steal the Bearer token
        page.on('request', req => {
            const headers = req.headers();
            if (headers['authorization'] && headers['authorization'].includes('Bearer')) {
                authToken = headers['authorization'];
            }
            if (headers['Authorization'] && headers['Authorization'].includes('Bearer')) {
                authToken = headers['Authorization'];
            }
        });

        console.log("Navegando a iRacing...");
        await page.goto('https://members-ng.iracing.com/', { waitUntil: 'networkidle2' }).catch(()=>{});

        // Try to auto-login
        await page.waitForSelector('input[name="identifier"], input[type="email"]', { timeout: 10000 }).catch(() => {});
        const emailInput = await page.$('input[name="identifier"]') || await page.$('input[type="email"]');
        if (emailInput) await emailInput.type(email);

        const passInput = await page.$('input[name="credentials.passcode"]') || await page.$('input[type="password"]');
        if (passInput) {
            await passInput.type(password);
            const submitBtn = await page.$('input[type="submit"]') || await page.$('button[type="submit"]');
            if (submitBtn) await submitBtn.click();
        }

        console.log("=========================================================");
        console.log(" Esperando a que inicies sesión y cargue el dashboard... ");
        console.log(" Si te pide Captcha, resuélvelo manualmente.");
        console.log("=========================================================");

        // Wait indefinitely until we capture the token (or until 3 minutes pass)
        let attempts = 0;
        while (!authToken && attempts < 90) {
            await new Promise(r => setTimeout(r, 2000));
            attempts++;
            // Click around to force requests if we are on dashboard but no token yet
            if (attempts % 5 === 0 && !authToken) {
                const isDashboard = await page.evaluate(() => window.location.href.includes('members-ng.iracing.com'));
                if (isDashboard) {
                    await page.evaluate(() => {
                        // try to trigger a router push or fetch
                        const links = document.querySelectorAll('a');
                        if(links.length > 5) links[5].click();
                        else window.dispatchEvent(new Event('focus'));
                    }).catch(()=>{});
                }
            }
        }

        if (!authToken) {
            console.log("No se pudo capturar el token después de 3 minutos. Cerrando.");
            await browser.close();
            return;
        }

        console.log("\\n>>> ¡TOKEN CAPTURADO CON ÉXITO! <<<\\n");
        await page.close(); // We don't need the page anymore!

        // Now we fetch the datasets using Node.js fetch with our stolen token
        const endpoints = {
            cars: 'https://members-ng.iracing.com/data/car/get',
            tracks: 'https://members-ng.iracing.com/data/track/get',
            seasons: 'https://members-ng.iracing.com/data/series/seasons'
        };

        for (const [name, url] of Object.entries(endpoints)) {
            console.log(`Solicitando enlace para ${name}...`);
            const res = await fetch(url, { headers: { 'Authorization': authToken } });
            if (!res.ok) {
                console.log(`Falló la petición para ${name}: ${res.status}`);
                continue;
            }
            const data = await res.json();
            if (data.link) {
                console.log(`Descargando JSON masivo de ${name}...`);
                const fileRes = await fetch(data.link);
                const fileText = await fileRes.text();
                const outPath = `C:\\Users\\keker\\.gemini\\antigravity\\scratch\\iracing-smart-schedule\\public\\${name}.json`;
                await fsPromises.writeFile(outPath, fileText);
                console.log(`>>> ${name}.json guardado!`);
            }
        }

        console.log("-----------------------------------------");
        console.log("¡Misión Cumplida! Cerrando navegador.");
        await browser.close();

    } catch (err) {
        console.error("Error crítico:", err);
    }
})();
