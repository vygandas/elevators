import { useState } from "react";
import { initBuildings } from "./initializers/initBuildings.ts";
import { Building } from "./core/building/Building.ts";

function App() {
  const [buildings] = useState(initBuildings());

  return (
    <>
      {buildings.map((building: Building) => (
        <div key={building.id}>{building.id}</div>
      ))}
    </>
  );
}

export default App;
