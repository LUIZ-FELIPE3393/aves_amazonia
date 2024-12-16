const params = new URLSearchParams(location.search);
const birdGalery = document.querySelector("#bird-gallery");
const birdArticle = document.querySelector("#bird-article");
const imageModal = document.querySelector("#image-modal");

let modalImageId = 0;

function showImageModal(imageName) {
    imageModal.classList.remove('hidden');
    imageModal.querySelector('img').setAttribute('src', imageName);
}

// Populate galery
axios.get('/bird/' + params.get('id')).then(async (json) => {
    const normalName = json.data['bdt_nome'].normalize('NFD').replace(/[\u0300-\u036f]|\s/g, '').toLowerCase();

    for (const image of json.data['imagens']) {
        const imageElement = document.createElement('img')
        imageElement.setAttribute('src', '/public/images/birds/' + image);
        imageElement.addEventListener('click', () => {
            showImageModal('/public/images/birds/' + image);
        })
        birdGalery.appendChild(imageElement);
    }

    // Set article
    const response = await axios.get('/readFile/' + normalName + '.html');
    birdArticle.innerHTML = response.data;
})

imageModal.querySelector('img').addEventListener('click', (e) => {
    e = undefined
})

imageModal.addEventListener('click', () => {
    imageModal.classList.add('hidden');
})


