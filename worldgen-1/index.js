import { system, world } from "@minecraft/server";
import FastNoiseLite from "./FastNoiseLite.js";

const overworld = world.getDimension("overworld");

const noise = new FastNoiseLite();

noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
noise.SetFractalOctaves(6);

const overworldScale = 3;

const startPos = { x: 800, y: -60, z: 300 };
const endPos = { x:1000, y: -60, z: 500 };

function* generateTerrain(start, end) {
    if (start.x > end.x) [start.x, end.x] = [end.x, start.x];
    if (start.y > end.y) [start.y, end.y] = [end.y, start.y];
    if (start.z > end.z) [start.z, end.z] = [end.z, start.z];

    for (let x = start.x; x <= end.x; x++) {
        for (let z = start.z; z <= end.z; z++) {
            const noiseValue = noise.GetNoise(x * overworldScale, end.y * overworldScale, z * overworldScale);

            const height = Math.floor(noiseValue * 16) + 32;

            try {
                overworld.getBlock({ x, y: height, z }).setType("minecraft:grass");
            } catch (_) {}
        }
        yield;
    }
}

system.runJob(generateTerrain(startPos, endPos));
