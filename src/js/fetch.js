import axios from 'axios';
export async function fetchPhotos(title, page) {
  const key = '33207584-dc406ff59b7ec425217ee82ec';
  return await axios
    .get(
      `https://pixabay.com/api/?key=${key}&q=${title}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    )
    .then(response => response.data)
    .catch(error => console.log(error.response.data));
}
