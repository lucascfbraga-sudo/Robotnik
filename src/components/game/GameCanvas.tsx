import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Image, Text, Group } from 'react-konva';
import useImage from 'use-image';

interface Entity {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
  targetX: number;
  targetY: number;
  spriteUrl: string;
}

const TILE_SIZE = 64;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

export function GameCanvas() {
  const [entities, setEntities] = useState<Entity[]>([
    { 
      id: 'golem-1', 
      x: 300, 
      y: 200, 
      name: 'Golem', 
      color: '#fbbf24', 
      targetX: 300, 
      targetY: 200,
      spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png'
    },
    { 
      id: 'char-1', 
      x: 500, 
      y: 400, 
      name: 'Brave Charizard', 
      color: '#ef4444', 
      targetX: 500, 
      targetY: 400,
      spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'
    },
    { 
      id: 'char-2', 
      x: 100, 
      y: 100, 
      name: 'Brave Charizard', 
      color: '#ef4444', 
      targetX: 100, 
      targetY: 100,
      spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'
    }
  ]);

  const requestRef = useRef<number>(0);

  const update = () => {
    setEntities(prev => prev.map(entity => {
      let { x, y, targetX, targetY } = entity;
      
      // Basic movement logic
      const dx = targetX - x;
      const dy = targetY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        // Pick new random target within bounds
        targetX = Math.random() * (MAP_WIDTH * TILE_SIZE);
        targetY = Math.random() * (MAP_HEIGHT * TILE_SIZE);
      } else {
        const speed = 1.5;
        x += (dx / dist) * speed;
        y += (dy / dist) * speed;
      }
      
      return { ...entity, x, y, targetX, targetY };
    }));
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="h-full w-full overflow-hidden bg-[#2d1b0d]">
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {/* Background Tiles (Simplified volcanic theme) */}
          {Array.from({ length: MAP_WIDTH }).map((_, i) => 
            Array.from({ length: MAP_HEIGHT }).map((_, j) => (
              <Rect
                key={`${i}-${j}`}
                x={i * TILE_SIZE}
                y={j * TILE_SIZE}
                width={TILE_SIZE}
                height={TILE_SIZE}
                fill={ (i + j) % 7 === 0 ? '#3e2723' : '#4e342e' }
                stroke="#2d1b0d"
                strokeWidth={0.5}
              />
            ))
          )}

          {/* Lava Pools (Visual representation) */}
          <Rect x={100} y={100} width={120} height={80} fill="#ff5722" cornerRadius={20} shadowBlur={20} shadowColor="#ff5722" opacity={0.8} />
          <Rect x={600} y={300} width={200} height={150} fill="#ff5722" cornerRadius={40} shadowBlur={30} shadowColor="#ff5722" opacity={0.8} />
          <Rect x={200} y={500} width={300} height={60} fill="#ff5722" cornerRadius={10} shadowBlur={15} shadowColor="#ff5722" opacity={0.8} />

          {/* Entities */}
          {entities.map((entity) => (
            <EntitySprite key={entity.id} entity={entity} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

function EntitySprite({ entity }: { entity: Entity }) {
  const [image] = useImage(entity.spriteUrl);
  
  return (
    <Group x={entity.x} y={entity.y}>
      {/* Sprite */}
      {image && (
        <Image
          image={image}
          width={80}
          height={80}
          offsetX={40}
          offsetY={60}
          pixelated={true}
        />
      )}
      
      {/* Name Tag */}
      <Rect
        x={-30}
        y={-75}
        width={60}
        height={14}
        fill="rgba(0,0,0,0.6)"
        cornerRadius={4}
      />
      <Text
        text={entity.name}
        x={-30}
        y={-73}
        width={60}
        align="center"
        fontSize={10}
        fill="white"
        fontStyle="bold"
      />
    </Group>
  );
}
