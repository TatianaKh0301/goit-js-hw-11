// TODO: add clear need to think where else пересмотреть как при введении и поиске очищается галерея
// TODO: check searchInput currentTarget video pagination 23min
// TODO check ' ' field?

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';
import axios from 'axios';
import './css/style.css';

const API_KEY = '30028288-057bf7cd6d2ddc6419712f1dc';
const messageWrangInput = 'Sorry, there are no images matching your search query. Please try again.';
let inputSearch = '';
let page = 1;
let per_page = 40;
let objectArr = {};


const refs = {
    form: document.querySelector('.search-form'),
    searchQuery: document.querySelector('input[name="searchQuery"]'),
    queryBtn: document.querySelector('button[type="submit"]'),
    galleryImages: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

const { form, queryBtn, galleryImages, searchQuery, loadMoreBtn } = refs;

form.addEventListener('input', throttle(onInputSearch, 1000));
form.addEventListener('submit', onSearchSubmit);
galleryImages.addEventListener('click', onGalleryClick);
loadMoreBtn.addEventListener('click', onLoadMore);

function onInputSearch(e) {
    inputSearch = searchQuery.value.toLowerCase().trim();
    console.log('inputSearch', inputSearch);
}

function onSearchSubmit(e) {
    e.preventDefault();
    page = 1;
    clearGallery();
    fetchImages();    
}

// function fetchImages() {
//     fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${inputSearch}&image_type=photo&orientation=horizontal
//             &safesearch=true&page=${page}&per_page=${per_page}`)
//             .then(response => {
//                 if (!response.ok || response.status === 404) {
//                     throw new Error(response.status);
//                 }
//                 return response.json()
//             })
//             .then((data) => {
//                 console.log('Data length', data.hits.length);
//                 if (data.hits.length === 0) {
//                     throw new Error();
//                 }
//                 renderGalleryCard(data);
//                 page += 1;
//                 let gallery = new SimpleLightbox('.gallery div a');
//             })
//             .catch(error => {
//                 Notiflix.Notify.failure(messageWrangInput);
//                 clearGallery();
//             });
// }

async function fetchImages() {
    try {
        const response =
        await axios
            .get(`https://pixabay.com/api/?key=${API_KEY}&q=${inputSearch}&image_type=photo&orientation=horizontal
            &safesearch=true&page=${page}&per_page=${per_page}`);
    console.log("response", response);
    console.log("response.data.hits", response.data.hits);
            const lengthArr = response.data.hits.length;
            if (lengthArr === 0) {
                throw new Error();
            }
            objectArr = response.data.hits;
            renderGalleryCard(objectArr);
            console.log("response.data.hits", objectArr);
            page += 1;
            let gallery = new SimpleLightbox('.gallery div a');
    }
    catch(error) {
        Notiflix.Notify.failure(messageWrangInput);
        clearGallery();
        }
    }

function renderGalleryCard(objectArr) {
    const galleryCard = objectArr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
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
    galleryImages.insertAdjacentHTML('beforeend', galleryCard);
}

function onGalleryClick(e) {
    e.preventDefault();
    if (!e.target.classList.contains('gallery__image')) {
        return;
    } 
}

function clearGallery() {
    galleryImages.innerHTML = '';
}

function onLoadMore() {
    fetchImages();
}