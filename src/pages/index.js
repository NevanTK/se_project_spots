import "./index.css";
import {
  enableValidation,
  disableButton,
  resetValidation,
  settings,
} from "../scripts/validation.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: " https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal__close-btn");
const submitButtons = document.querySelectorAll(".modal__save-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileBtn = document.querySelector(".profile__edit-btn");
// const profileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const profileNameEl = document.querySelector(".profile__name");
const profiledescriptionEl = document.querySelector(".profile__description");
const profileSaveBtn = editProfileModal.querySelector(".modal__save-btn");

const newPostModal = document.querySelector("#new-post-modal");
const newPostBtn = document.querySelector(".profile__post-btn");
// const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostDescriptionInput = newPostModal.querySelector(
  "#card-caption-input"
);
const newPostSaveBtn = newPostModal.querySelector(".modal__save-btn");

const previewModal = document.querySelector("#preview-modal");
const previewPost = previewModal.querySelector(".modal__image");
// const previewCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewCaption = previewModal.querySelector(".modal__caption");

const postImage = document.querySelector(".card__image");
const postCaption = document.querySelector(".card__title");
const postTemplate = document.querySelector("#post-template");
const postList = document.querySelector(".post__list");

function openModal(modal) {
  modal.classList.add("modal_is-open");

  document.addEventListener("keydown", handleEscape);
}
function closeModal(modal) {
  modal.classList.remove("modal_is-open");

  document.removeEventListener("keydown", handleEscape);
}

function getCardElement(data) {
  const postElement = postTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const postTitleEl = postElement.querySelector(".card__title");
  const postImageEl = postElement.querySelector(".card__image");

  postImageEl.src = data.link;
  postTitleEl.alt = data.name;
  postTitleEl.textContent = data.name;

  const likeBtnEl = postElement.querySelector(".card__like-btn");
  likeBtnEl.addEventListener("click", () => {
    likeBtnEl.classList.toggle("card__like-btn_active");
  });

  const deleteBtnEl = postElement.querySelector(".card__delete-btn");
  deleteBtnEl.addEventListener("click", () => {
    postElement.remove();
  });

  postImageEl.addEventListener("click", () => {
    previewPost.src = data.link;
    previewCaption.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return postElement;
}

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      modal.classList.remove("modal_is-open");
    }
  });
});

editProfileBtn.addEventListener("click", function () {
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
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-open");
    closeModal(openedModal);
  }
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profiledescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  disableButton(newPostSaveBtn, profileSaveBtn, settings);

  const postElement = getCardElement({
    name: newPostDescriptionInput.value,
    link: newPostImageInput.value,
  });
  postList.prepend(postElement);

  closeModal(newPostModal);

  newPostForm.reset();
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

newPostForm.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach(function (item) {
  // console.log(item.name);
  // console.log(item.link);
  const postElement = getCardElement(item);
  postList.append(postElement);
});

enableValidation(settings);
