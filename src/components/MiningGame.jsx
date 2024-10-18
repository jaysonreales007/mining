import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import HealthBar from './HealthBar';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GAME_ASPECT = GAME_WIDTH / GAME_HEIGHT;
const PLAYER_WIDTH = 0.5; // Assuming the player's width is 0.5 units

function MiningGame() {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    catcherPosition: { x: 0, y: -4 },
    rewards: [],
    obstacles: [],
    score: 0,
    health: 5,
    gameOver: false
  });

  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const playerRef = useRef(null);
  const rockModelRef = useRef(null);

  useEffect(() => {
    // Set up Three.js scene
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(75, GAME_WIDTH / GAME_HEIGHT, 0.1, 1000);
    cameraRef.current.position.z = 10;

    // Calculate the visible width of the game world at z=0
    const vFOV = THREE.MathUtils.degToRad(cameraRef.current.fov);
    const visibleHeight = 2 * Math.tan(vFOV / 2) * cameraRef.current.position.z;
    const visibleWidth = visibleHeight * GAME_ASPECT;

    rendererRef.current = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    rendererRef.current.setSize(GAME_WIDTH, GAME_HEIGHT);

    // Create player (catcher)
    const playerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    playerRef.current = new THREE.Mesh(playerGeometry, playerMaterial);
    playerRef.current.position.set(0, -4, 0);
    sceneRef.current.add(playerRef.current);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    sceneRef.current.add(directionalLight);

    // Load rock model
    const loader = new OBJLoader();
    loader.load('/images/rocks/rock1.obj', (obj) => {
      rockModelRef.current = obj;
      rockModelRef.current.scale.set(1, 1, 1); // Adjust scale as needed
      rockModelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshPhongMaterial({ color: 0x808080 });
        }
      });
    });

    // Function to create an obstacle
    const createObstacle = () => {
      // Check if the rock model is loaded
      if (rockModelRef.current) {
        // Clone the rock model
        const obstacle = rockModelRef.current.clone();
        
        // Set the initial position to be above the visible area
        const vFOV = THREE.MathUtils.degToRad(cameraRef.current.fov);
        const visibleHeight = 2 * Math.tan(vFOV / 2) * cameraRef.current.position.z;
        const startY = (visibleHeight / 2) + 1; // Start slightly above the visible area
        
        // Set the position and rotation of the obstacle
        obstacle.position.set(
          Math.random() * 8 - 4, // Random X position
          startY,                // Start from above the screen
          0
        );
        obstacle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        
        // Add velocity for falling
        obstacle.userData.velocity = 0.05; 
        // Add the obstacle to the scene and the game state
        sceneRef.current.add(obstacle);
        gameStateRef.current.obstacles.push(obstacle);
      }
    };

    let animationFrameId;

    const gameLoop = () => {
      if (gameStateRef.current.gameOver) return;

      // Move rewards and obstacles
      gameStateRef.current.rewards.forEach(reward => {
        reward.position.y -= 0.08; // Increased speed
        reward.position.x += Math.sin(reward.position.y * 0.1) * 0.05; // Add side-to-side movement
        if (reward.position.y < -5) {
          sceneRef.current.remove(reward);
          gameStateRef.current.rewards = gameStateRef.current.rewards.filter(r => r !== reward);
        }
      });

      gameStateRef.current.obstacles.forEach((obstacle, index) => {
        obstacle.position.y -= obstacle.userData.velocity;
        
        // Remove obstacle when it's below the screen
        if (obstacle.position.y < -5) {
          sceneRef.current.remove(obstacle);
          gameStateRef.current.obstacles.splice(index, 1);
        }
      });

      // Spawn new rewards and obstacles
      if (Math.random() < 0.005) { // Reduced spawn rate
        const rewardGeometry = new THREE.SphereGeometry(0.15, 32, 32); // Smaller rewards
        const rewardMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const reward = new THREE.Mesh(rewardGeometry, rewardMaterial);
        reward.position.set(Math.random() * 8 - 4, 5, 0);
        sceneRef.current.add(reward);
        gameStateRef.current.rewards.push(reward);
      }

      if (Math.random() < 0.02) {
        createObstacle();
      }

      // Check for collisions
      gameStateRef.current.rewards.forEach((reward, index) => {
        if (
          Math.abs(reward.position.x - playerRef.current.position.x) < 0.5 &&
          Math.abs(reward.position.y - playerRef.current.position.y) < 0.5
        ) {
          gameStateRef.current.score += 1;
          setScore(prevScore => prevScore + 1);
          sceneRef.current.remove(reward);
          gameStateRef.current.rewards.splice(index, 1);
        }
      });

      gameStateRef.current.obstacles.forEach((obstacle, index) => {
        if (
          Math.abs(obstacle.position.x - playerRef.current.position.x) < 2 &&
          Math.abs(obstacle.position.y - playerRef.current.position.y) < 2
        ) {
          gameStateRef.current.health -= 1;
          setHealth(prevHealth => {
            const newHealth = prevHealth - 1;
            if (newHealth <= 0) {
              gameStateRef.current.gameOver = true;
              setGameOver(true);
            }
            return newHealth;
          });
          sceneRef.current.remove(obstacle);
          gameStateRef.current.obstacles.splice(index, 1);
        }
      });

      // Update player position
      playerRef.current.position.x = gameStateRef.current.catcherPosition.x;

      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (gameStateRef.current.gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const normalizedX = (mouseX / GAME_WIDTH) * 2 - 1;
    
    // Calculate the visible width of the game world at z=0
    const vFOV = THREE.MathUtils.degToRad(cameraRef.current.fov);
    const visibleHeight = 2 * Math.tan(vFOV / 2) * cameraRef.current.position.z;
    const visibleWidth = visibleHeight * GAME_ASPECT;
    
    // Calculate the new x position
    const newX = normalizedX * (visibleWidth / 2);
    
    // Clamp the position to keep the player within the visible area
    const clampedX = Math.max(-(visibleWidth / 2) + PLAYER_WIDTH / 2, Math.min(newX, (visibleWidth / 2) - PLAYER_WIDTH / 2));
    
    gameStateRef.current.catcherPosition.x = clampedX;
  };

  const handleRestart = () => {
    gameStateRef.current = {
      catcherPosition: { x: 0, y: -4 },
      rewards: [],
      obstacles: [],
      score: 0,
      health: 5,
      gameOver: false
    };
    setScore(0);
    setHealth(5);
    setGameOver(false);
    
    // Clear existing objects from the scene
    while(sceneRef.current.children.length > 0){ 
      sceneRef.current.remove(sceneRef.current.children[0]); 
    }

    // Recreate player
    const playerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    playerRef.current = new THREE.Mesh(playerGeometry, playerMaterial);
    playerRef.current.position.set(0, -4, 0);
    sceneRef.current.add(playerRef.current);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    sceneRef.current.add(directionalLight);
  };

  return (
    <div className="relative bg-gray-700" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }} onMouseMove={handleMouseMove}>
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <div className="absolute top-0 left-0 p-4 text-xl font-bold">Score: {score}</div>
      <HealthBar health={health} />
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over</h2>
            <p className="text-xl mb-4">Your Score: {score}</p>
            <button
              onClick={handleRestart}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MiningGame;
