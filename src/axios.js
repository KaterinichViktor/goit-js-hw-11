import axios from 'axios';

const apiKey = '38773235-812bf30c777b3325b6df3cb6a';

export async function fetchImages(query, page) {
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

    const totalHits = response.data.totalHits;

    const images = response.data.hits;
    const totalPages = Math.ceil(totalHits / 40);

    return { images, totalPages };
  } catch (error) {
    throw error;
  }
}
