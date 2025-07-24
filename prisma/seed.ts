import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.incident.deleteMany()
  await prisma.camera.deleteMany()

  // Create cameras
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'Shop Floor A',
        location: 'Building A - Manufacturing Floor'
      }
    }),
    prisma.camera.create({
      data: {
        name: 'Vault',
        location: 'Building B - Secure Vault Area'
      }
    }),
    prisma.camera.create({
      data: {
        name: 'Entrance',
        location: 'Main Building - Front Entrance'
      }
    }),
    prisma.camera.create({
      data: {
        name: 'Parking Lot East',
        location: 'External - East Parking Area'
      }
    })
  ])

  console.log('Created cameras:', cameras.map(c => c.name).join(', '))

  // Generate incidents over a 24-hour span
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const incidentTypes = [
    'Unauthorised Access',
    'Gun Threat', 
    'Face Recognised',
    'Suspicious Activity',
    'Motion Detection',
    'Object Left Behind'
  ]

  const incidents = []

  // Generate 15 incidents across 24 hours
  for (let i = 0; i < 15; i++) {
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)]
    const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)]
    
    // Random time within the last 24 hours
    const randomTime = new Date(
      oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())
    )
    
    // End time is usually 2-30 minutes after start
    const endTime = new Date(randomTime.getTime() + (2 + Math.random() * 28) * 60 * 1000)
    
    // Some incidents are still ongoing (no end time)
    const isOngoing = Math.random() < 0.3
    
    // Some incidents are already resolved
    const isResolved = Math.random() < 0.4

    const incident = await prisma.incident.create({
      data: {
        cameraId: randomCamera.id,
        type: randomType,
        tsStart: randomTime,
        tsEnd: isOngoing ? null : endTime,
        thumbnailUrl: `/thumbnails/incident-${i + 1}.jpg`,
        resolved: isResolved
      }
    })

    incidents.push(incident)
  }

  console.log(`Created ${incidents.length} incidents`)
  
  // Show some statistics
  const unresolvedCount = incidents.filter(i => !i.resolved).length
  const ongoingCount = incidents.filter(i => !i.tsEnd).length
  
  console.log(`- ${unresolvedCount} unresolved incidents`)
  console.log(`- ${ongoingCount} ongoing incidents`)
  console.log('- Incident types:', [...new Set(incidents.map(i => i.type))].join(', '))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
