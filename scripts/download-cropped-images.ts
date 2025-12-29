import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const DATA_DIR = path.join(process.cwd(), 'data')
const CARDS_FILE = path.join(DATA_DIR, 'cards.json')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'cards', 'cropped')

interface CardImage {
  id: number
  image_url: string
  image_url_small: string
  image_url_cropped: string
}

interface YuGiOhCard {
  id: number
  card_images: CardImage[]
}

function downloadImage(url: string, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    
    const file = fs.createWriteStream(filePath)
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close()
        fs.unlinkSync(filePath)
        if (response.headers.location) {
          downloadImage(response.headers.location, filePath).then(resolve).catch(reject)
        } else {
          reject(new Error(`Redirect without location header: ${response.statusCode}`))
        }
      } else {
        file.close()
        fs.unlinkSync(filePath)
        reject(new Error(`Failed to download: ${response.statusCode}`))
      }
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      reject(err)
    })
  })
}

async function downloadCroppedImages() {
  // Create cropped images directory if it doesn't exist
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }

  // Load cards data
  if (!fs.existsSync(CARDS_FILE)) {
    console.error(`Cards file not found at ${CARDS_FILE}`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(CARDS_FILE, 'utf-8')
  const data = JSON.parse(fileContent)
  
  if (!data.data || !Array.isArray(data.data)) {
    console.error('Invalid card data format')
    process.exit(1)
  }

  const cards: YuGiOhCard[] = data.data
  const totalCards = cards.length
  let downloaded = 0
  let skipped = 0
  let failed = 0

  console.log(`Found ${totalCards} cards. Starting download of cropped images...`)

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    const croppedUrl = card.card_images[0]?.image_url_cropped

    if (!croppedUrl) {
      skipped++
      continue
    }

    const imagePath = path.join(IMAGES_DIR, `${card.id}.jpg`)

    // Skip if already downloaded
    if (fs.existsSync(imagePath)) {
      skipped++
      continue
    }

    try {
      await downloadImage(croppedUrl, imagePath)
      downloaded++
      
      if ((i + 1) % 100 === 0) {
        console.log(`Progress: ${i + 1}/${totalCards} (Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed})`)
      }
    } catch (error) {
      failed++
      console.error(`Failed to download image for card ${card.id}:`, error instanceof Error ? error.message : error)
    }

    // Add a small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  console.log(`\nDownload complete!`)
  console.log(`Total: ${totalCards}`)
  console.log(`Downloaded: ${downloaded}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Failed: ${failed}`)
}

downloadCroppedImages().catch(console.error)

