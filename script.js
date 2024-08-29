let htmlEditor, cssEditor, jsEditor;
let currentTheme = 'light';
let components = [];
let templates = {};

function initializeEditors() {
    htmlEditor = CodeMirror(document.getElementById("htmlEditor"), {
        mode: "xml",
        theme: "monokai",
        lineNumbers: true
    });

    cssEditor = CodeMirror(document.getElementById("cssEditor"), {
        mode: "css",
        theme: "monokai",
        lineNumbers: true
    });

    jsEditor = CodeMirror(document.getElementById("jsEditor"), {
        mode: "javascript",
        theme: "monokai",
        lineNumbers: true
    });

    updatePreview();
}

function updatePreview() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();

    const previewContent = `
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>${js}</script>
            </body>
        </html>
    `;

    const previewPane = document.getElementById('previewPane');
    previewPane.srcdoc = previewContent;
}

function addComponent(type) {
    const component = {
        type,
        content: `<div class="editable" contenteditable="true">New ${type} component</div>`
    };
    components.push(component);
    renderComponents();
    updatePreview();
}

function renderComponents() {
    const componentList = document.getElementById('componentList');
    componentList.innerHTML = '';
    components.forEach((component, index) => {
        const componentElement = document.createElement('div');
        componentElement.className = 'component';
        componentElement.innerHTML = component.content;
        componentElement.setAttribute('draggable', 'true');
        componentElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
        });
        componentList.appendChild(componentElement);
    });
}

function changeTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = currentTheme;
    // Update CodeMirror theme
    const newTheme = currentTheme === 'light' ? 'default' : 'monokai';
    htmlEditor.setOption('theme', newTheme);
    cssEditor.setOption('theme', newTheme);
    jsEditor.setOption('theme', newTheme);
}

function saveProject() {
    const projectData = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
        components
    };
    const blob = new Blob([JSON.stringify(projectData)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.json';
    a.click();
}

function loadProject(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const projectData = JSON.parse(e.target.result);
        htmlEditor.setValue(projectData.html);
        cssEditor.setValue(projectData.css);
        jsEditor.setValue(projectData.js);
        components = projectData.components;
        renderComponents();
        updatePreview();
    };
    reader.readAsText(file);
}

function exportFiles() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Project</title>
    <style>${css}</style>
</head>
<body>
${html}
<script>${js}</script>
</body>
</html>`;

    const files = [
        { name: 'index.html', content: fullHtml, type: 'text/html' },
        { name: 'styles.css', content: css, type: 'text/css' },
        { name: 'script.js', content: js, type: 'text/javascript' }
    ];

    files.forEach(file => {
        const blob = new Blob([file.content], { type: file.type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
    });
}

async function loadTemplates() {
    const templateNames = ['blog', 'portfolio', 'landing', 'e-commerce', 'resume'];
    const templateSelect = document.getElementById('templateSelect');
    
    for (const name of templateNames) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        templateSelect.appendChild(option);
    }

    templateSelect.addEventListener('change', async (e) => {
        if (e.target.value) {
            const template = await fetchTemplate(e.target.value);
            if (template) {
                htmlEditor.setValue(template.html);
                cssEditor.setValue(template.css);
                jsEditor.setValue(template.js);
                updatePreview();
            }
        }
    });
}

async function fetchTemplate(name) {
    try {
        const response = await fetch(`templates/${name}.json`);
        return await response.json();
    } catch (error) {
        console.error('Error loading template:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeEditors();
    loadTemplates();

    document.getElementById('addComponent').addEventListener('click', () => addComponent('div'));
    document.getElementById('changeTheme').addEventListener('click', changeTheme);
    document.getElementById('saveProject').addEventListener('click', saveProject);
    document.getElementById('loadProject').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => loadProject(e.target.files[0]);
        input.click();
    });
    document.getElementById('exportFiles').addEventListener('click', exportFiles);

    document.getElementById('templateSelect').addEventListener('change', (e) => {
        const selectedTemplate = templates[e.target.value];
        if (selectedTemplate) {
            htmlEditor.setValue(selectedTemplate.html);
            cssEditor.setValue(selectedTemplate.css);
            jsEditor.setValue(selectedTemplate.js);
            updatePreview();
        }
    });

    document.getElementById('previewPane').addEventListener('click', (e) => {
        if (e.target.classList.contains('editable')) {
            e.target.focus();
        }
    });

    htmlEditor.on('change', updatePreview);
    cssEditor.on('change', updatePreview);
    jsEditor.on('change', updatePreview);
});

// Initialize Mermaid
mermaid.initialize({ startOnLoad: true });

// Function to convert Markdown to HTML
function convertMarkdownToHtml(markdown) {
    return marked.parse(markdown);
}
