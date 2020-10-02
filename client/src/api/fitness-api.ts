import { Fitness } from '../types/Fitness'
import { apiEndpoint } from '../config'
import Axios from 'axios'

export async function getAvailableFitness(idToken: string): Promise<Fitness[]> {
  console.log('Fetching available Fitness')

  const response = await Axios.get(`${apiEndpoint}/fitness/available`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Fitness:', response.data)
  return response.data.items
}

export async function getMyFitness(idToken: string): Promise<Fitness[]> {
  console.log('Fetching my Fitness')

  const response = await Axios.get(`${apiEndpoint}/fitness/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}` 
    }
  })
  console.log('Fitness:', response.data)//
  return response.data.items
}

export async function createFitness(
  idToken: string,
  name: string,
  description: string
): Promise<Fitness> {
  const response = await Axios.post(
    `${apiEndpoint}/fitness`,
    JSON.stringify({
      name,
      description
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function fitness(
  idToken: string,
  fitnessId: string,
  userId: string
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/fitness/${fitnessId}/${userId}/fitness`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function availableFitness(
  idToken: string,
  fitnessId: string
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/fitness/${fitnessId}/available`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteFitness(idToken: string, fitnessId: string): Promise<void> {
  await Axios.delete(`${apiEndpoint}/fitness/${fitnessId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  fitnessId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/fitness/${fitnessId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
