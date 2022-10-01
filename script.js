const dbFileName = 'localDB.json'

getLocalDBdata().then(buildMasonryGallery).then(() => {
  document.querySelector('img').onload = (e) => console.log(getImageDimensions(e.target))

})

function getLocalDBdata() {
  return fetch(dbFileName).then(response => response.json())
}

function buildMasonryGallery(data) {
  const gallery = document.querySelector('#gallery')

  for (const item of data) {
    const { id, prompt } = item
    const image = document.createElement('img')

    image.src = `images/${id}.png`
    image.alt = image.title = prompt
    gallery.append(image)
  }
}

function getImageDimensions(image) {
  const { naturalWidth, naturalHeight } = image

  return { naturalWidth, naturalHeight }
}
