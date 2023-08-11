import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '38773235-812bf30c777b3325b6df3cb6a';
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  gallery.innerHTML = '';
  currentQuery = e.target.searchQuery.value;
  currentPage = 1;
  searchImages(currentQuery, currentPage);
});

loadMoreButton.addEventListener('click', () => {
  currentPage++;
  searchImages(currentQuery, currentPage);
});

async function searchImages(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const images = response.data.hits;
    if (images.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

    images.forEach((image) => {
      const imgElement = document.createElement('img');
      imgElement.src = image.webformatURL;
      imgElement.alt = image.tags;

      const infoDiv = document.createElement('div');
      infoDiv.className = 'info';
      infoDiv.innerHTML = `
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      `;

      const photoCardDiv = document.createElement('div');
      photoCardDiv.className = 'photo-card';
      photoCardDiv.appendChild(imgElement);
      photoCardDiv.appendChild(infoDiv);

      gallery.appendChild(photoCardDiv);
    });

    if (images.length < 40) {
      loadMoreButton.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreButton.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}
