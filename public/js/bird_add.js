const inputName = document.querySelector('#name')
const inputBinomial = document.querySelector('#binomial')
const inputExtinction = document.querySelector('#extinction')
const inputDescription = document.querySelector('#tinymce')
const prefabs = document.querySelector('#prefabs')

if (localStorage.getItem('editBird') !== 'None') {
    //Enable Bird edit
    axios.get('/bird/' + localStorage.getItem('editBird')).then(json => {
        console.log(json)
        inputName.value = json.data['bdt_nome'];
        inputBinomial.value = json.data['bdt_nomecientifico'];
        inputExtinction.value = json.data['bdt_escextincao'];
        tinymce.activeEditor.on('init', () => {
            tinymce.activeEditor.setContent(json.data['bdt_descricao'])
        })
        var index = 0
        for (const image of json.data['images']) {
            const imageElement = prefabs.querySelector('#bdt-image').cloneNode()
            index++
            imageElement.setAttribute('src', '/public/images/birds/' + image)
            document.querySelector('#galeria').appendChild(imageElement)
        }
    })
}