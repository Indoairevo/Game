import * as THREE from "https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js";
import { Game } from "./game.js";

// Initialize the game
const app = document.getElementById("app");
const game = new Game(app);
game.start();
