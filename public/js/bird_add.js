const inputName = document.querySelector('#name')
const inputBinomial = document.querySelector('#binomial')
const inputExtinction = document.querySelector('#extinction')
const inputDescription = document.querySelector('#tinymce')
const inputImage = document.querySelector('#images')
const galeriaImages = document.querySelector('#galeria')
const prefabs = document.querySelector('#prefabs')

document.addEventListener('DOMContentLoaded', (e) => {
    previewFile()
    if (localStorage.getItem('editBird') !== 'None') {
        //Enable Bird edit
        axios.get('/bird/' + localStorage.getItem('editBird')).then(json => {
            console.log(json)
            inputName.value = json.data['bdt_nome'];
            inputBinomial.value = json.data['bdt_nomecientifico'];
            inputExtinction.value = json.data['bdt_escextincao'];
            inputDescription.innerHTML = json.data['bdt_descricao'];
            var index = 0
            for (const image of json.data['images']) {
                const imgElement = prefabs.querySelector('#bdt-image').cloneNode()
                index++
                imgElement.setAttribute('src', '/public/images/birds/' + image)
                galeriaImages.appendChild(imgElement)
            }
            document.dispatchEvent(new Event('initData'))
        }).catch(err => {
            console.log(err)
        })
    } else {
        document.dispatchEvent(new Event('initData'))
    }
})

function previewFile() {
    for (const imgElement of galeriaImages.querySelectorAll('img')) {
        galeriaImages.removeChild(imgElement)
    }

    for (const image of inputImage.files) {
        const reader = new FileReader()
        const imgElement = prefabs.querySelector('#bdt-image').cloneNode()

        reader.onloadend = () => {
            imgElement.src = reader.result
            galeriaImages.appendChild(imgElement)
        }

        if (image) {
            reader.readAsDataURL(image)
        } else {
            imgElement.src = ''
        }
    }
}

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(document.querySelector('form'))

    axios.put('/bird', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
})
