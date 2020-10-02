import { CreateFitnessRequest } from "../requests/CreateFitnessRequest";
import * as uuid from "uuid";
import { FitnessItem } from "../models/FitnessItem";
import { FitnessAccess } from "../dataLayer/fitnessAccess";
import { createLogger } from "../utils/logger";

const logger = createLogger("auth");

const fitnessAccess = new FitnessAccess();

export async function getAvailableFitness(): Promise<FitnessItem[]> {
  return await fitnessAccess.getAvailableFitness();
}

export async function getUserFitness(userId: string): Promise<FitnessItem[]> {
  return await fitnessAccess.getUserFitness(userId);
}

export async function createFitness(
  createFitnessRequest: CreateFitnessRequest,
  userId: string
): Promise<FitnessItem> {
  logger.info("Generating uuid...");

  const itemId = uuid.v4();

  return await fitnessAccess.createFitness({
    available: "true",
    createdAt: new Date().toISOString(),
    userId,
    fitnessId: itemId,
    name: createFitnessRequest.name,
    description: createFitnessRequest.description,
  });
}

export async function fitness(userId: string, fitnessId: string) {
  return await fitnessAccess.fitness(userId, fitnessId);
}

export async function availableFitness(userId: string, fitnessId: string) {
  return await fitnessAccess.availableFitness(userId, fitnessId);
}

export async function deleteFitness(userId: string, fitnessId: string) {
  return await fitnessAccess.deleteFitness(userId, fitnessId);
}

export async function updateUrl(userId: string, fitnessId: string) {
  await fitnessAccess.updateUrl(userId, fitnessId);
}
