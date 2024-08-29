document.addEventListener('DOMContentLoaded', () => {
    const componentsPanel = document.getElementById('components-panel');
    const previewContent = document.getElementById('preview-content');
    const htmlCode = document.getElementById('html-code');
    const downloadCombined = document.getElementById('download-combined');
    const downloadHTML = document.getElementById('download-html');
    const downloadCSS = document.getElementById('download-css');
    const downloadJS = document.getElementById('download-js');

    const components = {
        header: '<h1>Header</h1>',
        paragraph: '<p>This is a paragraph.</p>',
        image: '<img src="https://via.placeholder.com/150" alt="Placeholder">',
        button: '<button>Click me</button>'
    };

    let builtHTML = '';

    componentsPanel.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const componentType = e.target.getAttribute('data-component');
            addComponent(componentType);
        }
    });

    function addComponent(type) {
        const component = components[type];
        builtHTML += component;
        updatePreview();
        updateCodeView();
    }

    function updatePreview() {
        previewContent.innerHTML = builtHTML;
    }

    function updateCodeView() {
        htmlCode.textContent = builtHTML;
    }

    function downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    downloadCombined.addEventListener('click', () => {
        const combinedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Built Website</title>
    <style>
        ${document.querySelector('link[rel="stylesheet"]').textContent}
    </style>
</head>
<body>
    ${builtHTML}
    <script>
        ${document.querySelector('script[src="builder.js"]').textContent}
    </script>
</body>
</html>`;
        downloadFile(combinedHTML, 'built-website.html', 'text/html');
    });

    downloadHTML.addEventListener('click', () => {
        downloadFile(builtHTML, 'content.html', 'text/html');
    });

    downloadCSS.addEventListener('click', () => {
        const css = document.querySelector('link[rel="stylesheet"]').textContent;
        downloadFile(css, 'styles.css', 'text/css');
    });

    downloadJS.addEventListener('click', () => {
        const js = document.querySelector('script[src="builder.js"]').textContent;
        downloadFile(js, 'script.js', 'text/javascript');
    });
});
