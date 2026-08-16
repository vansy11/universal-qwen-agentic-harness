const { chromium } = require('playwright');

async function autoEvaluate(generatedAppUrl, originalPrompt) {
    let browser;
    const evaluationReport = [];

    try {
        // Launch Playwright headless browser
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        // 1. Check if app crashes on load
        page.on('pageerror', error => {
            evaluationReport.push(`CRITICAL FAIL: Runtime error - ${error.message}`);
        });

        await page.goto(generatedAppUrl, { waitUntil: 'networkidle' });

        // 2. Check if 3D Canvas is actually rendering
        const isCanvasRendered = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return canvas && canvas.width > 0 && canvas.height > 0;
        });

        if (!isCanvasRendered) {
            evaluationReport.push("FAIL: 3D Canvas element is missing or not rendering.");
        }

        // 3. Check Scroll Animation
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await page.waitForTimeout(1500); // Wait for animation to trigger
        
        const scrollAnimationTriggered = await page.evaluate(() => {
            const animatedElement = document.querySelector('[data-animate]'); 
            if (!animatedElement) return false;
            const style = window.getComputedStyle(animatedElement);
            return style.opacity !== '0' || style.transform !== 'none';
        });

        if (!scrollAnimationTriggered) {
            evaluationReport.push("FAIL: Scroll animations are not triggering.");
        }

    } catch (error) {
        evaluationReport.push(`CRITICAL FAIL: Evaluation script crashed - ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }

    return evaluationReport.length === 0
        ? { status: "PASS", message: "All runtime evaluations passed successfully." }
        : { status: "FAIL", reasons: evaluationReport };
}

module.exports = { autoEvaluate };
