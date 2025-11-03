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
