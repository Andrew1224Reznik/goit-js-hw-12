import axios from 'axios';

const baseUrl = 'https://pixabay.com/api/';
const myApiKey = '53364265-bba438c586e7b8abf4f224af4';

async function getImagesByQuery(query, page = 1) {
  try {
    const response = await axios(baseUrl, {
      params: {
        key: myApiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 15,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

export { getImagesByQuery };
