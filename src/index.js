import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './axios';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  captionType: 'attr',
  captionsData: 'alt',
});
let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = e.target.searchQuery.value.trim();
  if (query === '') return;
  gallery.innerHTML = '';
  currentQuery = query;
  currentPage = 1;
  try {
    const { images, totalPages } = await fetchImages(currentQuery, currentPage);
    renderImages(images);
    if (currentPage < totalPages) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
    }
  } catch (error) {
    Notiflix.Notify.failure("Error fetching images. Please try again.");
  }
});

loadMoreButton.addEventListener('click', async () => {
  currentPage++;
  try {
    const { images, totalPages } = await fetchImages(currentQuery, currentPage);
    renderImages(images);
    if (currentPage >= totalPages) {
      loadMoreButton.style.display = 'none';
    }
  } catch (error) {
    Notiflix.Notify.failure("Error fetching more images. Please try again.");
  }
});

function renderImages(images) {
  const photoCards = images.map((image) => {
    return `
      <div class="photo-card">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}">
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </div>
    `;
  });

  gallery.innerHTML += photoCards.join('');
  lightbox.refresh();
}

loadMoreButton.style.display = 'none';


