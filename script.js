//     adaptation

let viewport_width = window.innerWidth;

let wrapper = document.querySelector('.wrapper');
let afterR_wrapper = document.querySelector('.afterR-wrapper')
let task_container = document.querySelector('.task-container');

function check_width(width) {
    if (width <= 1120) {
        wrapper.appendChild(task_container);
    } else {
        afterR_wrapper.appendChild(task_container);
    }
};

check_width(viewport_width);

window.addEventListener('resize', () => {
    viewport_width = window.innerWidth;
    check_width(viewport_width);
})


//     editor
const editorBlock = document.querySelector('.editor-block');
const languageSelect = document.getElementById('editor-lang-select');
const runButton = document.querySelector('.editor-run-btn');
const output = document.querySelector('.output-block');

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' } });

require(['vs/editor/editor.main'], function () {

    // Создаём редактор
    let editor = monaco.editor.create(editorBlock, {
        value: "",
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true
    });

    // Обновляем язык редактора при смене
    languageSelect.addEventListener('change', (event) => {
        const newLanguage = event.target.value;
        monaco.editor.setModelLanguage(editor.getModel(), newLanguage);
    });

    // Функция эмуляции выполнения кода
    function simulateServerExecution(code) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (code.includes('error')) {
                    resolve({
                        status: 'error',
                        error: 'SyntaxError: Unexpected token'
                    });
                } else {
                    resolve({
                        status: 'success',
                        output: `Code executed successfully:<br><br><pre class="output-code-content">${code}<pre>`
                    });
                }
            }, 1000);
        });
    }

    // Обработка нажатия на кнопку Run
    runButton.onclick = () => {
        const code = editor.getValue();

        simulateServerExecution(code)
            .then((result) => {
                if (result.status === 'success') {
                    output.innerHTML = `${result.output}`;
                } else if (result.status === 'error') {
                    output.innerHTML = `Error:<br>${result.error}`;
                }
            })
            .catch((err) => {
                output.innerHTML = `Unexpected error:<br>${err.message}`;
            });
    };
});