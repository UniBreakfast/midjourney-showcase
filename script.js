const dbFileName = 'localDB.json'
const imageFolder = 'images'

getLocalDBdata().then(buildGallery).then(() => {
  document.querySelector('img').onload = (e) => console.log(getImageDimensions(e.target))

})

function getLocalDBdata() {
  return fetch(dbFileName).then(response => response.json())
}

function buildGallery(data) {
  const gallery = document.querySelector('#gallery')

  const path = location.host.endsWith('.github.io') ? '' : imageFolder

  for (const item of data) {
    const { id, prompt, imageURL } = item
    const image = document.createElement('img')

    image.src = path ? `${path}/${id}.png` : imageURL
    image.alt = image.title = prompt
    image.onerror = () => image.remove()
    gallery.append(image)
  }
}

function getImageDimensions(image) {
  const { naturalWidth, naturalHeight } = image

  return { naturalWidth, naturalHeight }
}
