const prefabs = document.querySelector("#prefabs")
const modal = document.querySelector("#deleteModal")
const modalSimBtn = modal.querySelector("#btn-sim")
const modalNaoBtn = modal.querySelector("#btn-nao")

let aveDeleteID = null;

// Lê dados do banco
axios.get('/bird')
    .then(json => {
        for (const bird of json.data) {
            let thumbnail = bird['thumbnail'];
            if (thumbnail === null) {
                thumbnail = "/bird-not-found.jpg"
            }

            const birdElement = document.createElement('div')
            birdElement.setAttribute('class', 'flex bg-lime-100 shadow rounded')
            birdElement.setAttribute('bird-id', json['bdt_id'])
            birdElement.innerHTML = prefabs.querySelector("#bird-data").innerHTML
                .replace(':bdt-image:', '/public/images/birds' + thumbnail)
                .replace(':bdt-nome:', bird['bdt_nome'])
                .replace(':bdt-nomecientifico:', bird['bdt_nomecientifico'])
            birdElement.querySelector("#btn-delete").addEventListener('click', (e) => {
                modal.classList.remove('hidden')
                aveDeleteID = bird['bdt_id']
            })
            birdElement.querySelector("#btn-edit").addEventListener('click', (e) => {
                localStorage.setItem('editBird', bird['bdt_id'])
                window.location.href = '/adicionar-ave'
            })
            document.querySelector('#bird-list').appendChild(birdElement)
        }
    })

// Ações do modal de exclusão
modalNaoBtn.addEventListener('click', (e) => {
    modal.classList.add('hidden')
})

modalSimBtn.addEventListener('click', (e) => {
    axios.delete('/bird/' + aveDeleteID)
        .then(res => {
            console.log(res)
            location.reload()
        })
        .catch(err => console.error(err))
})

// Botão de adicionar pássaro
document.querySelector('#add-bird').addEventListener('click', () => {
    localStorage.setItem('editBird', 'None')
})