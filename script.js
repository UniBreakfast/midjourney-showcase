const dbFileName = 'localDB.json'

getLocalDBdata().then(buildMasonryGallery).then(() => {
  document.querySelector('img').onload = (e) => console.log(getImageDimensions(e.target))

})

function getLocalDBdata() {
  return fetch(dbFileName).then(response => response.json())
}

function buildMasonryGallery(data) {
  const gallery = document.querySelector('#gallery')
  const rows = gallery.children
  const imagesPerRow = 3

  gallery.style.setProperty('--images-per-row', imagesPerRow)

  let i = 0

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]

    for (let imageIndex = 0; imageIndex < imagesPerRow; imageIndex++) {
      const imageData = data[i++]
      const { id, prompt } = imageData
      const image = document.createElement('img')

      image.src = `images/${id}.png`
      image.alt = image.title = prompt

      row.append(image)
    }
  }
}




function getImageDimensions(image) {
  const { naturalWidth, naturalHeight } = image

  return { naturalWidth, naturalHeight }
}
