document.addEventListener('initData', () => {
    tinymce.init({
        selector: 'textarea#tinymce',
        suffix: '.min',
        menubar: 'edit insert format',
        licence_key: 'gpl',
        init_instance_callback: (editor) => {
            document.dispatchEvent(new Event('initializeTinymce'))
        }
    })
})