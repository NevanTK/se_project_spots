export function setButtonText(
  button,
  isLoading,
  isDeleting = 'Deleting...',
  defualtText = 'Save',
  loadingText = 'Saving...'
) {
  if (isLoading) {
    button.textContent = 'Saving...';
  } else {
    button.textContent = 'Save';
  }
}

export function setDeleteButtonText(
  button,
  isDeleting,
  deletingText = 'Deleting...',
  defaultText = 'Yes'
) {
  if (isDeleting) {
    button.textContent = 'Deleting...';
  } else {
    button.textContent = 'Delete';
  }
}
