const prefabs = document.querySelector("#prefabs")
const birdGallery = document.querySelector('#bird-gallery')

// Ler as aves do banco e exibir no grid galeria
axios.get('bird').then(json => {
    for (const bird of json.data) {
        let thumbnail;
        if (bird['thumbnail'] === null) {
            thumbnail = "/public/images/bird-not-found.jpg";
        } else {
            thumbnail = "/public/images/birds" + bird['thumbnail'];
        }

        const birdElement = document.createElement('div')
            birdElement.setAttribute('class', 'flex bg-lime-100 shadow rounded')
            birdElement.setAttribute('bird-id', json['bdt_id'])
            birdElement.innerHTML = prefabs.querySelector("#bird-data").innerHTML
                .replace(':bdt-image:', thumbnail)
                .replace(':bdt-nome:', bird['bdt_nome'])
                .replace(':bdt-nomecientifico:', bird['bdt_nomecientifico'])
            document.querySelector('#bird-list').appendChild(birdElement)
    }
})