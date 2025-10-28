export function setButtonText(
  button,
  isLoading,
  isDeleting = 'Deleting...',
  defualtText = 'Save',
  loadingText = 'Saving...'
) {
  //   if (document.getElementById('confirm') === true) {
  //     button.textContent = isDeleting;
  //   } else if (isLoading) {
  //     button.textContent = isLoading;
  //   } else {
  //     button.textContent = 'Save';
  //   }

  if (isLoading) {
    button.textContent = 'Saving...';
  } else if (isDeleting) {
    button.textContent = 'Deleting...';
  } else {
    button.textContent = 'Save';
  }
}
