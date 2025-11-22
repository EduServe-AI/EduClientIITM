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

    const previousImageExtension = formData.get('previousImageExtension') as
      | string
      | null

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and student ID are required.' },
        { status: 400 }
      )
    }

    // Delete previous image if it exists
    if (previousImageExtension) {
      const previousFileName = `${userId}.jpg`
      const previousBlob = containerClient.getBlockBlobClient(previousFileName)
      try {
        await previousBlob.delete()
      } catch (error) {
        console.log('No previous image found or error deleting:', error)
        // Continue with upload even if delete fails
      }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 2MB.' },
        { status: 400 }
      )
    }

    // Create a unique filename with student ID and JPG extension
    const fileName = `${userId}.jpg`

    // Convert file to buffer and convert to JPG using sharp
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Convert to JPG format regardless of input format
    const jpgBuffer = await sharp(fileBuffer).jpeg({ quality: 90 }).toBuffer()

    // Upload to Azure Blob Storage
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)
    await blockBlobClient.uploadData(jpgBuffer, {
      blobHTTPHeaders: { blobContentType: 'image/jpeg' },
    })

    // Get the URL of the uploaded file
    const fileUrl = blockBlobClient.url

    return NextResponse.json(
      {
        message: 'Profile image uploaded successfully',
        url: fileUrl,
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
