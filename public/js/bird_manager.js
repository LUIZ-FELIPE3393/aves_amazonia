const prefabs = document.querySelector("#prefabs")
const modal = document.querySelector("#deleteModal")
const modalSimBtn = modal.querySelector("#btn-sim")
const modalNaoBtn = modal.querySelector("#btn-nao")

let aveDeleteID = null;

//Read data from Database
axios.get('/bird')
    .then(json => {
        console.log(json)
        for (const bird of json.data) {
            const birdElement = document.createElement('div')
            birdElement.setAttribute('class', 'flex bg-lime-100 shadow rounded')
            birdElement.innerHTML = prefabs.querySelector("#bird-data").innerHTML
                .replace(':bdt-image:', '/public/images/birds' + bird['thumbnail'])
                .replace(':bdt-nome:', bird['bdt_nome'])
                .replace(':bdt-nomecientifico:', bird['bdt_nomecientifico'])
            birdElement.querySelector("#btn-delete").addEventListener('click', (e) => {
                modal.classList.remove('hidden')
                aveDeleteID = bird['bdt_id']
            })
            document.querySelector('#bird-list').appendChild(birdElement)
        }
    })

modalNaoBtn.addEventListener('click', (e) => {
    modal.classList.add('hidden')
})

modalSimBtn.addEventListener('click', (e) => {
    axios.delete('/bird/' + aveDeleteID)
        .then(res => console.log(res))
        .catch(err => console.error(err))
})