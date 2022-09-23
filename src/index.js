import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';
import axios from 'axios';
import './css/style.css';

const API_KEY = '30028288-057bf7cd6d2ddc6419712f1dc';

let inputSearch = '';
let page = 1;
let per_page = 40;
let objectArr = {};
let gallery = {};

const messageEmptyInput = 'Sorry, write your search query.';
const messageWrangInput = 'Sorry, there are no images matching your search query. Please try again.';
const messageEndGallery = "We're sorry, but you've reached the end of search results.";

const refs = {
    form: document.querySelector('.search-form'),
    searchQuery: document.querySelector('input[name="searchQuery"]'),
    queryBtn: document.querySelector('button[type="submit"]'),
    galleryImages: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    endGalleryWarning: document.querySelector('.end-gallery-wrap'),
}

const { form, queryBtn, galleryImages, searchQuery, loadMoreBtn, endGalleryWarning } = refs;

form.addEventListener('input', throttle(onInputSearch, 1000));
form.addEventListener('submit', onSearchSubmit);
galleryImages.addEventListener('click', onGalleryClick);
loadMoreBtn.addEventListener('click', onLoadMore);

hideLoadMoreBtn();

function onInputSearch(e) {
    inputSearch = searchQuery.value.toLowerCase().trim();
}

function onSearchSubmit(e) {
    e.preventDefault();
    hideLoadMoreBtn();
    page = 1;
    clearGallery();
    endGalleryClear();
    if (inputSearch === '' || inputSearch === ' ') {
        Notiflix.Notify.failure(messageEmptyInput);
        return;
    }
    fetchImages();
    showLoadMoreBtn();   
    }    


async function fetchImages() {
    try {
        const response =
        await axios
            .get(`https://pixabay.com/api/?key=${API_KEY}&q=${inputSearch}&image_type=photo&orientation=horizontal
            &safesearch=true&page=${page}&per_page=${per_page}`);

        const lengthArr = response.data.hits.length;
        console.log("lengthArr", lengthArr);
        if (lengthArr === 0) {
            throw new Error();
        }

        const totalHits = response.data.totalHits;
 
        console.log("totalHits", totalHits);
        objectArr = response.data.hits;
        renderGalleryCard(objectArr);
        if (page === 1) {
             Notiflix.Notify.info(`Hooray! We found ${totalHits} images`);
        }
        gallery = new SimpleLightbox('.gallery div a');
        gallery.refresh();
        
        const endGallery = parseInt(totalHits / per_page) + 1;
        console.log("endGallery", endGallery);
        console.log("page", page);
        if (endGallery === page) {
            hideLoadMoreBtn();
            const endMsg =
                `<p class = "end-gallery">${messageEndGallery}</p>`;
            endGalleryWarning.innerHTML = endMsg;
            Notiflix.Notify.info(messageEndGallery);
            return;
        }
        page += 1;
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

function endGalleryClear() {
    endGalleryWarning.innerHTML = '';
}

function onLoadMore() {
    fetchImages();
}

function showLoadMoreBtn() {
    loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreBtn() {
    loadMoreBtn.classList.add('is-hidden');
}