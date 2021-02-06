import modalTpl from '../templates/modal.hbs';
import refs from './refs';
import { saveToWatchedList, saveToQueueList } from './localStorage';
import { normalizeGenres } from './genres';
import { updateHomeMarkup } from './homePageRander';
import {myLibraryClickHandler} from './myLibrary'

const apiKey = '030295876ec9637cb436e167c8c73741';
const baseUrl = 'https://api.themoviedb.org/3';

function getMovieById(movieId) {
  return fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => updateModalMarkup(data))
    .catch(error => console.log(error));
}

refs.galleryRef.addEventListener('click', movieDetailsHandler);

function movieDetailsHandler(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const movieId = event.target.dataset.id;
  localStorage.setItem('movieId', movieId);
  getMovieById(movieId);

  onOpenModal();

   document.addEventListener('click', event => {       
     console.log(event.toElement.className);
    switch (event.toElement.className) {
      case 'modal-btns-left': {
        const id = localStorage.getItem('movieId');
        console.log('watched fired');
        saveToWatchedList(id);
        event.toElement.innerHTML = 'Remove from "WATCHED"';
        return;
      }
      case 'modal-btns-add-to-queue': {
        const id = localStorage.getItem('movieId');
        console.log('queue fired');
        saveToQueueList(id);
        event.toElement.innerHTML = 'Remove from "QUEUE"';
        // event.toElement.innerHTML = 'added to watched';
        return;
      }
      case 'header-link-nav-modal modal-home-link': {
        updateHomeMarkup();
        onCloseModal();
        break;
      }
      case 'header-link-nav-modal modal-library': {
myLibraryClickHandler();
onCloseModal();
break;
      }
      default: {
        console.log('default');
        return;
      }
    }
  });
}

// function checkList() {
// 222222
// }

function updateModalMarkup(data) {
  normalizeGenres(data);
  const modalMarkup = modalTpl(data);
  refs.modalContentRef.insertAdjacentHTML('beforeend', modalMarkup);
}

function onOpenModal() {
  refs.backdropRef.classList.add('is-open');
  window.addEventListener('keydown', onPressESC);
  
}

// function myLibraryModalClickHandler() {
//   onCloseModal()
//   //  updateLibraryGalleryMarkup()
// }

refs.backdropRef.addEventListener('click', onBackdropClick);

function onCloseModal() {
  window.removeEventListener('keydown', onPressESC);
  refs.backdropRef.classList.remove('is-open');
  cleanModalContent();
}

function onBackdropClick(event) {
  if (event.target === refs.backdropRef) onCloseModal();
}

function onPressESC(event) {
  if (event.code === 'Escape') onCloseModal();
}

function cleanModalContent() {
  refs.modalContentRef.innerHTML = '';
}



export { getMovieById };
