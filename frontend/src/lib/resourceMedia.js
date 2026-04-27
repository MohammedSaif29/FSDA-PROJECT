export const TYPE_IMAGE_FALLBACK = {
  TEXTBOOK: 'https://source.unsplash.com/400x300/?book',
  PAPER: 'https://source.unsplash.com/400x300/?research',
  GUIDE: 'https://source.unsplash.com/400x300/?learning',
};

export const getResourceFallbackImage = (resource = {}) => {
  if (resource.category) {
    return `https://source.unsplash.com/400x300/?${encodeURIComponent(resource.category.toLowerCase())}`;
  }

  return TYPE_IMAGE_FALLBACK[resource.type] || TYPE_IMAGE_FALLBACK.GUIDE;
};
