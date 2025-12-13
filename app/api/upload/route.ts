import { BlobServiceClient } from '@azure/storage-blob'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// Get the connection string and container name from environment variables
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME

if (!connectionString || !containerName) {
  throw new Error(
    'Azure Storage connection string or container name is not configured.'
  )
}

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString)
const containerClient = blobServiceClient.getContainerClient(containerName)

export async function POST(request: NextRequest) {
  try {
    // 1. Get the token from the request headers
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.split(' ')[1] // Extracts the token from "Bearer <token>"

    // 2. Add authentication logic here
    if (!token) {
      // Here you would typically verify the token's validity
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') as string
    const imageType = (formData.get('imageType') as string) || 'profile' // 'profile' or 'banner'

    const previousImageExtension = formData.get('previousImageExtension') as
      | string
      | null

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and user ID are required.' },
        { status: 400 }
      )
    }

    // Validate imageType
    if (!['profile', 'banner'].includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid image type. Must be "profile" or "banner".' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (2MB for profile, 5MB for banner)
    const maxSize = imageType === 'banner' ? 5 * 1024 * 1024 : 2 * 1024 * 1024
    const sizeLabel = imageType === 'banner' ? '5MB' : '2MB'
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${sizeLabel}.` },
        { status: 400 }
      )
    }

    // Create folder path: userId/imageType.jpg (e.g., "user123/profile.jpg")
    const folderPath = `${userId}`
    const fileName = `${folderPath}/${imageType}.jpg`

    // Check if folder exists by listing blobs with the userId prefix
    // If no blobs exist with this prefix, we'll create the folder structure when we upload
    const blobsInFolder = containerClient.listBlobsFlat({ prefix: folderPath })
    let folderExists = false
    // for await (const _ of blobsInFolder) {
    //   folderExists = true
    //   break // We just need to know if at least one blob exists
    // }

    const iterator = blobsInFolder[Symbol.asyncIterator]()
    const firstBlob = await iterator.next()
    folderExists = !firstBlob.done

    console.log(
      `Folder ${folderPath} ${folderExists ? 'exists' : 'does not exist'}. Proceeding with upload...`
    )

    // Delete previous image if it exists
    if (previousImageExtension) {
      const previousFileName = `${folderPath}/${imageType}.jpg`
      const previousBlob = containerClient.getBlockBlobClient(previousFileName)
      try {
        await previousBlob.delete()
        console.log(`Deleted previous ${imageType} image: ${previousFileName}`)
      } catch (error) {
        console.log(
          `No previous ${imageType} image found or error deleting:`,
          error
        )
        // Continue with upload even if delete fails
      }
    }

    // Convert file to buffer and convert to JPG using sharp
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Convert to JPG format regardless of input format
    // Use higher quality for banner images
    const quality = imageType === 'banner' ? 95 : 90
    const jpgBuffer = await sharp(fileBuffer).jpeg({ quality }).toBuffer()

    // Upload to Azure Blob Storage with folder structure
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)
    await blockBlobClient.uploadData(jpgBuffer, {
      blobHTTPHeaders: { blobContentType: 'image/jpeg' },
    })

    console.log(`Uploaded ${imageType} image to: ${fileName}`)

    // Get the URL of the uploaded file
    const fileUrl = blockBlobClient.url

    return NextResponse.json(
      {
        message: `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} image uploaded successfully`,
        url: fileUrl,
        imageType,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
