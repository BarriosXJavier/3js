import Moon from "./Moon";
import Cloud from "./Cloud";
import Stars from "./Stars";
import { Canvas } from "@react-three/fiber";

export default function MoonScene() {
  return (
    <div className="w-full h-screen bg-slate-950">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        shadows
      >
        <color attach="background" args={["#0a0a15"]} />
        <fog attach="fog" args={["#0a0a15", 10, 50]} />
        
        <Stars />
        <Moon />
        
        <Cloud startPos={[-10, 2, -5]} />
        <Cloud startPos={[0, -1, -4]} />
        <Cloud startPos={[10, 4, -6]} />
        <Cloud startPos={[-5, 0, -5]} />
        <Cloud startPos={[8, 3, -5]} />
        
        <ambientLight intensity={0.05} />
      </Canvas>
    </div>
  );
}
