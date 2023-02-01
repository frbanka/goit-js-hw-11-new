import { fetchPhotos } from './fetch';
import { Notify } from 'notiflix';
const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const galleryText = document.querySelector('.gallery-text');
const buttonLoad = document.querySelector('.load-more');
const body = document.querySelector('body');

searchForm.addEventListener('submit', searchImages);

let pageNumber = 1;
let foundImages = 0;
let searchText = '';
galleryText.innerHTML = 'Find your perfect photo';

function createPhotoCard(arr) {
  const markup = arr
    .map(item => {
      return `<a href='${item.largeImageURL}'><div class="photo-card">
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${item.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${item.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${item.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${item.downloads}
      </p>
    </div>
  </div>`;
    })
    .join('');
  gallery.innerHTML += markup;
}

async function searchImages(e) {
  e.preventDefault();
  searchText = e.currentTarget.searchQuery.value;
  body.classList.add('body-change');

  if (searchText === '') {
    return;
  }

  pageNumber = 1;
  const response = await fetchPhotos(searchText, pageNumber);
  foundImages = response.hits.length;

  if (response.totalHits > 40) {
    buttonLoad.removeAttribute('hidden');
  } else {
    buttonLoad.setAttribute('hidden', '');
  }
  if (response.totalHits > 0) {
    Notify.success(`Hooray! We found ${response.totalHits} images.`);
    gallery.innerHTML = '';
    createPhotoCard(response.hits);
    return;
  }
  if (response.totalHits === 0) {
    gallery.innerHTML = '';
    body.classList.remove('body-change');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    buttonLoad.setAttribute('hidden', '');
  }
}
buttonLoad.addEventListener('click', async function () {
  pageNumber += 1;
  const response = await fetchPhotos(searchText, pageNumber);
  createPhotoCard(response.hits);
  foundImages += response.hits.length;
  if (foundImages === response.totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    buttonLoad.setAttribute('hidden', '');
  }
});
