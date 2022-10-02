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

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const { id, prompt, imageURL } = item
    const image = document.createElement('img')

    // if (i > 10) image.hidden = true

    image.src = path ? `${path}/${id}.png` : imageURL
    image.alt = image.title = prompt
    image.loading = "lazy"
    image.onerror = () => image.remove()
    gallery.append(image)
  }
}

function getImageDimensions(image) {
  const { naturalWidth, naturalHeight } = image

  return { naturalWidth, naturalHeight }
}
