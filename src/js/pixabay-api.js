import axios from 'axios';

const baseUrl = 'https://pixabay.com/api/';
const myApiKey = '53364265-bba438c586e7b8abf4f224af4';

function getImagesByQuery(query) {
  return axios(baseUrl, {
    params: {
      key: myApiKey,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error);
    });
}

export { getImagesByQuery };
