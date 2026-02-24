import { SandboxData, SandboxElement } from '@resumebuilder/shared';

interface RenderOptions {
    isPro?: boolean;
    customWatermark?: string;
    watermarkStyle?: 'tiled' | 'corner'; // tiled = repeated across page, corner = bottom-right
}

// Generate tiled watermark CSS and HTML
function generateTiledWatermark(text: string, opacity: number = 0.08): string {
    return `
        <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        ">
            <div style="
                position: absolute;
                top: -100%;
                left: -100%;
                width: 300%;
                height: 300%;
                display: flex;
                flex-wrap: wrap;
                align-content: center;
                justify-content: center;
                transform: rotate(-30deg);
                opacity: 1;
            ">
                ${Array(100).fill(null).map((_, i) => `
                    <div style="
                        width: 250px;
                        height: 150px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: 'Inter', Arial, sans-serif;
                        font-size: 20px;
                        font-weight: 700;
                        color: rgba(255, 255, 255, ${opacity * 8}); /* Increased visibility but white/light */
                        text-shadow: 0 0 2px rgba(0,0,0,0.1);
                        letter-spacing: 1px;
                        transform: rotate(-15deg); /* Inner rotation for text */
                        white-space: nowrap;
                    ">
                        <span style="
                            padding: 8px 16px;
                            border: 2px solid rgba(0,0,0,${opacity});
                            border-radius: 4px;
                            color: rgba(0,0,0,${opacity * 2});
                        ">${text}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Generate corner watermark
function generateCornerWatermark(text: string): string {
    return `
        <div style="
            position: absolute;
            bottom: 8mm;
            right: 8mm;
            font-family: 'Inter', sans-serif;
            font-size: 10px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.4);
            letter-spacing: 0.5px;
            z-index: 9999;
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 3px;
        ">${text}</div>
    `;
}

export function renderSandbox(data: SandboxData, options: RenderOptions = {}): string {
    const { isPro = false, customWatermark, watermarkStyle = 'tiled' } = options;
    const elementsHtml = data.elements.map(renderElement).join('\n');

    let watermarkHtml = '';

    if (!isPro) {
        // Free tier: tiled "Resume Sandbox" watermark across entire page
        watermarkHtml = generateTiledWatermark('Resume Sandbox', 0.06);
    } else if (customWatermark && customWatermark.trim()) {
        // Pro+ with custom watermark
        if (watermarkStyle === 'tiled') {
            watermarkHtml = generateTiledWatermark(customWatermark.trim(), 0.05);
        } else {
            watermarkHtml = generateCornerWatermark(customWatermark.trim());
        }
    }
    // Pro without custom watermark = no watermark

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Roboto:wght@400;500;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
            background-color: #ffffff;
            overflow: hidden;
            position: relative;
            box-sizing: border-box;
        }
        
        * {
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    ${elementsHtml}
    ${watermarkHtml}
</body>
</html>
    `;
}

function renderElement(element: SandboxElement): string {
    const { style, type, content } = element;

    // Convert style object to CSS string
    const cssStyles = [
        `position: absolute`,
        `left: ${style.left}px`,
        `top: ${style.top}px`,
        `width: ${style.width}px`,
        `height: ${style.height}px`,
        `z-index: ${style.zIndex}`,
        style.fontSize ? `font-size: ${style.fontSize}px` : '',
        style.fontWeight ? `font-weight: ${style.fontWeight}` : '',
        style.textAlign ? `text-align: ${style.textAlign}` : '',
        style.color ? `color: ${style.color}` : '',
        style.backgroundColor ? `background-color: ${style.backgroundColor}` : '',
        style.borderRadius ? `border-radius: ${style.borderRadius}px` : '',
        style.borderWidth ? `border-width: ${style.borderWidth}px` : '',
        style.borderColor ? `border-color: ${style.borderColor}` : '',
        style.borderWidth ? `border-style: solid` : '',
        style.opacity ? `opacity: ${style.opacity}` : '',
        style.fontFamily ? `font-family: ${style.fontFamily}` : '',
        `overflow: hidden`,
        `display: flex`,
        `align-items: center`,
        `justify-content: ${style.textAlign === 'center' ? 'center' : style.textAlign === 'right' ? 'flex-end' : 'flex-start'}`,
        `padding: 4px`,
    ].filter(Boolean).join('; ');

    let innerContent = '';

    if (type === 'text') {
        innerContent = `<div style="width: 100%; height: 100%; white-space: pre-wrap;">${content}</div>`;
    } else if (type === 'image') {
        innerContent = `<img src="${content}" style="width: 100%; height: 100%; object-fit: cover;" />`;
    } else if (type === 'shape') {
        // Shape is just the container with background/border, handled by cssStyles
        innerContent = '';
    } else if (type === 'icon') {
        // For server-side rendering, we might need to use an SVG string or a library that renders SVGs to string.
        // For now, we'll just render a placeholder or text if we can't easily render Lucide icons on the server without React.
        // A simple workaround is to assume the client sends the SVG string or we just render the name for now.
        // BETTER APPROACH: Since we are in a Node environment, we can't easily use React components.
        // We will render a text placeholder for icons for this iteration, or try to use a simple mapping if possible.
        innerContent = `<div style="font-size: 10px;">[Icon: ${content}]</div>`;
    }

    return `<div style="${cssStyles}">${innerContent}</div>`;
}
