document.addEventListener('initData', () => {
    tinymce.init({
        selector: 'textarea#tinymce',
        suffix: '.min',
        plugins: 'lists',
        toolbar: 'blocks | undo redo | bold italic',
        menubar: false,
        licence_key: 'gpl',
        init_instance_callback: (editor) => {
            document.dispatchEvent(new Event('initializeTinymce'))
        }
    })
})