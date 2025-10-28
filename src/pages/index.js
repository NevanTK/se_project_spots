import './index.css';
import {
  enableValidation,
  disableButton,
  resetValidation,
  settings,
} from '../scripts/validation.js';
import Api from '../utils/Api.js';
import { setButtonText } from '../utils/helpers.js';

// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: " https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: 'https://around-api.en.tripleten-services.com/v1',
  headers: {
    authorization: '22e63734-6a5b-430a-88d2-7a018c259f3f',
    'Content-Type': 'application/json',
  },
});

//destructure second item in call back of .then()
api
  .getAppInfo()
  .then(([cards]) => {
    cards.forEach((item) => {
      const postElement = getCardElement(item);
      postList.append(postElement);
    });
    //handle user info separately
    //set src of avatr img
    //set text conttent of both text elements

    getUserInfo().then((userData) => {
      profileimgEl.src = userData.avatar;
      profileNameEl.textContent = userData.name;
      profiledescriptionEl.textContent = userData.about;
    });
  })
  .catch(console.error);

const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.modal__close-btn');
const submitButtons = document.querySelectorAll('.modal__save-btn');
const editProfileModal = document.querySelector('#edit-profile-modal');
const editProfileBtn = document.querySelector('.profile__edit-btn');
// const profileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector('.modal__form');
const editProfileNameInput = editProfileModal.querySelector(
  '#profile-name-input'
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  '#profile-description-input'
);
const profileNameEl = document.querySelector('.profile__name');
const profiledescriptionEl = document.querySelector('.profile__description');
const profileSaveBtn = editProfileModal.querySelector('.modal__save-btn');

const avatarEditModal = document.querySelector('#avatar-modal');
const avatarEditBtn = document.querySelector('.profile__avatar-btn');
const avatarForm = avatarEditModal.querySelector('.modal__form');
// const avatarCloseBtn = avatarEditModal.querySelector(".modal__close-btn");
const profileimgEl = document.querySelector('.profile__avatar');
const avatarSaveBtn = avatarEditModal.querySelector('.modal__save-btn');
const avatarInput = avatarEditModal.querySelector('#profile-avatar-input');

const deleteModal = document.querySelector('#delete-modal');
const deleteForm = deleteModal.querySelector('.modal__form');
//fix delete modal selectors
const deleteCancelBtn = deleteModal.querySelector('#cancel');
const deleteSaveBtn = deleteModal.querySelector('#confirm');

const newPostModal = document.querySelector('#new-post-modal');
const newPostBtn = document.querySelector('.profile__post-btn');
// const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector('.modal__form');
const newPostImageInput = newPostModal.querySelector('#card-image-input');
const newPostDescriptionInput = newPostModal.querySelector(
  '#card-caption-input'
);
const newPostSaveBtn = newPostModal.querySelector('.modal__save-btn');

const previewModal = document.querySelector('#preview-modal');
const previewPost = previewModal.querySelector('.modal__image');
// const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewCaption = previewModal.querySelector('.modal__caption');

const postImage = document.querySelector('.card__image');
const postCaption = document.querySelector('.card__title');
const postTemplate = document.querySelector('#post-template');
const postList = document.querySelector('.post__list');

let selectedCard, selectedCardId;

function openModal(modal) {
  modal.classList.add('modal_is-open');

  document.addEventListener('keydown', handleEscape);
}
function closeModal(modal) {
  modal.classList.remove('modal_is-open');

  document.removeEventListener('keydown', handleEscape);
}

function getCardElement(data) {
  const postElement = postTemplate.content
    .querySelector('.card')
    .cloneNode(true);
  const postTitleEl = postElement.querySelector('.card__title');
  const postImageEl = postElement.querySelector('.card__image');

  postImageEl.src = data.link;
  postTitleEl.alt = data.name;
  postTitleEl.textContent = data.name;

  api.getUserInfo().then((userData) => {
    if (data.likes.some((like) => like._id === userData._id)) {
      const likeBtnEl = postElement.querySelector('.card__like-btn');
      likeBtnEl.classList.add('card__like-btn_active');
    }
    if (data.owner._id === userData._id) {
      const deleteBtnEl = postElement.querySelector('.card__delete-btn');
      deleteBtnEl.style.display = 'block';
    }
  });

  //like card
  function handleLikeCard(evt, id) {
    if (evt.target.classList.contains('card__like-btn_active')) {
      api
        .likeStatus(id, false)
        .then((data) => {
          evt.target.classList.add('card__like-btn_active');
        })
        .catch(console.error);
    } else {
      api
        .likeStatus(id, true)
        .then((data) => {
          evt.target.classList.remove('card__like-btn_active');
        })
        .catch(console.error);
    }
  }
  const likeBtnEl = postElement.querySelector('.card__like-btn');
  likeBtnEl.addEventListener('click', (evt) => handleLikeCard(evt, data._id));

  //delete card
  function handleDeleteCard() {
    openModal(deleteModal);
  }
  const deleteBtnEl = postElement.querySelector('.card__delete-btn');
  deleteBtnEl.addEventListener('click', () => handleDeleteCard(data._id));

  postImageEl.addEventListener('click', () => {
    previewPost.src = data.link;
    previewCaption.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return postElement;
}

modals.forEach((modal) => {
  modal.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('modal')) {
      modal.classList.remove('modal_is-open');
    }
  });
});

editProfileBtn.addEventListener('click', function () {
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profiledescriptionEl.textContent;
  // editProfileModal.classList.add("modal_is-open");
  openModal(editProfileModal);
});

closeButtons.forEach((button) => {
  const modal = button.closest('.modal');
  button.addEventListener('click', () => closeModal(modal));
});

newPostBtn.addEventListener('click', function () {
  openModal(newPostModal);
});

avatarEditBtn.addEventListener('click', function () {
  openModal(avatarEditModal);
});

function handleEscape(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.modal_is-open');
    closeModal(openedModal);
  }
}

// deleteSaveBtn.addEventListener('click', function () {
//   handDeleteSubmit();
//   closeModal(deleteModal);
// });

deleteCancelBtn.addEventListener('click', function () {
  closeModal(deleteModal);
});
//lading text for delete submit
function handDeleteSubmit(evt) {
  evt.preventDefault();
  setButtonText(deleteSaveBtn, true);

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteSaveBtn, false);
      disableButton(newPostSaveBtn, profileSaveBtn, avatarSaveBtn, settings);
    });
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  // submitBtn.textContent = 'Saving...';
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profiledescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
      // profileSaveBtn.textContent = 'Save';
      disableButton(newPostSaveBtn, profileSaveBtn, avatarSaveBtn, settings);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  setButtonText(newPostSaveBtn, true);

  api
    .postNewCard({
      name: newPostDescriptionInput.value,
      link: newPostImageInput.value,
    })
    .then((data) => {
      const postElement = getCardElement(data);
      postList.prepend(postElement);
      closeModal(newPostModal);
      newPostForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(newPostSaveBtn, false);
      disableButton(newPostSaveBtn, profileSaveBtn, avatarSaveBtn, settings);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  setButtonText(avatarSaveBtn, true);

  api
    .editAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      profileimgEl.src = data.avatar;
      closeModal(avatarEditModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSaveBtn, false);
      disableButton(newPostSaveBtn, profileSaveBtn, avatarSaveBtn, settings);
    });
}

deleteForm.addEventListener('submit', handDeleteSubmit);

avatarForm.addEventListener('submit', handleAvatarSubmit);

editProfileForm.addEventListener('submit', handleEditProfileSubmit);

newPostForm.addEventListener('submit', handleAddCardSubmit);

enableValidation(settings);
