const { createWriteStream, promises: { readFile, writeFile, mkdir } } = require('fs')
const { get } = require('https')

const dbFileName = 'localDB.json'
const imageFolder = 'images'
const baseURL = 'https://www.midjourney.com/api/public-feed/'
const concurrentDownloads = 1

let mode = process.argv[2]

main()

async function main() {
  const [localDB, currentlyAvailableData] = await forAll(
    readLocalDB(),
    getCurrentlyAvailableImagesData()
  )

  const knownIDs = localDB.map(item => item.id)
  const newData = uniqualize(currentlyAvailableData.filter(
    item => !knownIDs.includes(item.id)
  ))

  includeTo(localDB, newData)

  await createImagesFolder()

  const dataToFetch = mode === 'all' ? localDB : newData

  await forAll(storeLocalDB(localDB), downloadImages(dataToFetch))

  displayResults(dataToFetch, localDB)
}

async function createImagesFolder() {
  try {
    await mkdir(imageFolder)
    mode = 'all'
  } catch { }
}

async function displayResults(data, db) {
  console.log(`Downloaded ${data.length} new images (${db.length - data.length} -> ${db.length})`)

  let readme = await readFile('README.md', 'utf8')

  readme = readme.replace(/\d{3,}/, db.length)

  await writeFile('README.md', readme)
}

function forAll(...promises) {
  return Promise.all(promises)
}

async function readLocalDB() {
  try {
    return JSON.parse(await readFile(dbFileName))
  } catch {
    return []
  }
}

async function getCurrentlyAvailableImagesData() {
  const links = generateLinks()
  const arraysOfItems = await forAll(...links.map(getDataFrom))

  return arraysOfItems.flat().map(formBySchema)
}

function generateLinks() {
  const orders = ['', 'hot', 'top', 'popular', 'new']
  const pages = 3
  const caches = 2 // don't know what it means
  const links = []

  for (let cache = 1; cache <= caches; cache++) {
    for (const order of orders) {
      for (let page = 0; page < pages; page++) {
        let link = baseURL

        if (cache || order || page) link += '?'

        if (cache) link += `cache=${cache}`

        if (order) link += `${cache ? '&' : ''}orderBy=${order}`

        if (page) link += `${cache || order ? '&' : ''}page=${page}`

        links.push(link)
      }
    }
  }

  return links
}

async function getDataFrom(link, tries = 3) {
  return new Promise((resolve, reject) => {
    get(link, async response => {
      try {
        const json = await getBody(response)
        const data = JSON.parse(json)
        resolve(data)
      } catch {
        if (tries) {
          try {
            resolve(await getDataFrom(link, tries - 1))
          } catch {
            reject()
          }
        }

        reject()
      }
    }).on('error', reject)
  })
}

function formBySchema(item) {
  const { id, username: author, prompt, image_paths: [imageURL] } = item

  return { id, author, prompt, imageURL }
}

function includeTo(localDB, newData) {
  localDB.push(...newData)
}

async function storeLocalDB(localDB) {
  await writeFile(dbFileName, JSON.stringify(localDB, null, 2))
}

async function downloadImages(newData) {
  for (let i = 0; i < newData.length; i += concurrentDownloads) {
    const items = [newData[i]]

    for (let j = 1; j < concurrentDownloads; j++) {
      if (newData[i + j]) items.push(newData[i + j])
    }

    await forAll(...items.map(downloadImage))
  }
}

async function downloadImage({ id, imageURL, author, prompt }) {
  const imageFileExt = imageURL.split('.').pop()
  const imageFileName = `${id}.${imageFileExt}`
  const infoFileName = `${id}.txt`
  const infoFileContent = `${author || 'author_unknown'}: \n${prompt}`

  return await forAll(
    new Promise((resolve, reject) => {
      get(imageURL, response => {
        response.pipe(createWriteStream(`${imageFolder}/${imageFileName}`))
        response.on('end', resolve)
        response.on('error', reject)
      })
    }),
    writeFile(`${imageFolder}/${infoFileName}`, infoFileContent)
  )
}

function uniqualize(array) {
  const ids = []

  return array.filter(item => {
    if (ids.includes(item.id)) return false

    ids.push(item.id)

    return true
  })
}

function getBody(response) {
  return new Promise((resolve, reject) => {
    const chunks = []

    response.on('data', chunk => chunks.push(chunk))
    response.on('end', () => resolve(Buffer.concat(chunks).toString()))
    response.on('error', reject)
  })
}
