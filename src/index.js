// TODO: ставить задержку при вводе в инпут или нет?
// TODO: add clear

import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '30028288-057bf7cd6d2ddc6419712f1dc';
let inputSearch = '';
// const info

const refs = {
    form: document.querySelector('.search-form'),
    searchQuery: document.querySelector('input[name="searchQuery"]'),
    queryBtn: document.querySelector('button[type="submit"]'),
    galleryImages: document.querySelector('.gallery'),
}

const { form, searchQuery, queryBtn, galleryImages } = refs;

form.addEventListener('input', onInputSearch);
form.addEventListener('submit', onSearchSubmit);
galleryImages.addEventListener('click', onGalleryClick);

function onInputSearch(e) {
    galleryImages.innerHTML = '';
    inputSearch = searchQuery.value.toLowerCase().trim();
    console.log('inputSearch', inputSearch);
}

function onSearchSubmit(e) {
    e.preventDefault();
    fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${inputSearch}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(response => response.json())
        .then((data) => {
            renderGalleryCard(data);
            let gallery = new SimpleLightbox('.gallery div a');
        });
    
}

function renderGalleryCard(data) {
    
    galleryImages.innerHTML = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `
        
        <div class="photo-card">
            <a class="gallery__link" href=${largeImageURL}>
                <img class ="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width = 320 height = 240/>
            </a>  
                <div class="info">
                    <p class="info-item">
                        <b>Likes<span>${likes}</span></b>
                    </p>
                    <p class="info-item">
                        <b>Views<span>${views}</span></b>
                    </p>
                    <p class="info-item">
                        <b>Comments<span>${comments}</span></b>
                    </p>
                    <p class="info-item">
                        <b>Download<span>${downloads}</span></b>
                    </p>
                </div>
            
        </div>
              
        `).join('');
    console.log("galleryImages.innerHTML", galleryImages.innerHTML);
}

function onGalleryClick(e) {
    e.preventDefault();
    if (!e.target.classList.contains('gallery__image')) {
        return;
    } 
}
