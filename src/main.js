import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery } from './js/render-functions.js';
import { showLoader } from './js/render-functions.js';
import { hideLoader } from './js/render-functions.js';
import { clearGallery } from './js/render-functions.js';
import { showLoadMoreButton } from './js/render-functions.js';
import { hideLoadMoreButton } from './js/render-functions.js';

const form = document.querySelector('.form');
const input = form.querySelector('input[name="search-text"]');
const btnLoadmore = document.querySelector('.btn-loadmore');

let currentQuery = '';
let currentPage = 1;

hideLoader();
hideLoadMoreButton();

form.addEventListener('submit', handleSubmit);
btnLoadmore.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();

  const query = input.value.toLowerCase().trim();

  if (!query) {
    iziToast.warning({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }
  currentQuery = query;
  currentPage = 1;

  clearGallery();
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);
    input.value = '';

    const totalPages = Math.ceil(data.totalHits / data.hits.length);

    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    hideLoadMoreButton();
  } finally {
    hideLoader();
  }
}

async function handleLoadMore() {
  currentPage++;

  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);
    scrollPage();

    const totalPages = Math.ceil(data.totalHits / data.hits.length);
    if (currentPage >= totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function scrollPage() {
  if (currentPage === 1) return;

  const card = document.querySelector('.gallery .gallery-item');
  if (!card) return;

  const { height: cardHeight } = card.getBoundingClientRect();

  requestAnimationFrame(() => {
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}
