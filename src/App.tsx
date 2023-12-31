import { useState } from "react";
import { initBuildings } from "./initializers/initBuildings.ts";
import { Building } from "./core/building/Building.ts";
import { BuildingView } from "./views/building/building.view.tsx";
import styled from "styled-components";
import { Controller } from "./core/controller/Controller.ts";
import { Elevator } from "./core/elevator/Elevator.ts";
import { v4 as uuid } from "uuid";

function App() {
  const [tick, setTick] = useState("0");
  const [buildings] = useState(initBuildings(() => setTick(uuid())));

  return (
    <>
      <h1>Elevators controller app</h1>
      <div data-tick={tick} />
      {buildings.map((building: Building) => (
        <BuildingView
          key={building.id}
          info={
            <>
              <strong>{building.title}</strong> with floors:{" "}
              {building.getMaxFloors()}
            </>
          }
        >
          <ElevatorZone>
            {building.getElevatorControllers().map((controller: Controller) => (
              <div
                key={controller.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  {Array(controller.getTotalFloors())
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={`${_.toString()}${i.toString()}`}
                        style={{
                          border: "1px solid grey",
                          width: "19px",
                          height: "19px",
                        }}
                      >
                        <Button
                          onClick={() =>
                            controller.callToFloor(
                              controller.getTotalFloors() - (i + 1),
                            )
                          }
                        >
                          <strong>{controller.getTotalFloors() - i}</strong>
                        </Button>
                      </div>
                    ))}
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-end",
                    }}
                  >
                    {controller.getElevators().map((elevator: Elevator) => (
                      <div key={elevator.getId()}>
                        {Array(elevator.getTotalFloors())
                          .fill(0)
                          .map((_, i) => (
                            <Floor
                              key={`${elevator.getId()}${_.toString()}${i.toString()}`}
                              isElevatorHere={
                                elevator.getCurrentFloor() ===
                                elevator.getTotalFloors() - (i + 1)
                              }
                            />
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </ElevatorZone>
        </BuildingView>
      ))}
    </>
  );
}

export default App;

const Button = styled.button`
  color: white;
  background: darkred;
  font-size: 10px;
  display: block;
  height: 17px;
  width: 18px;
  border: none;
  padding: 0;
`;

const ElevatorZone = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: end;
`;

const Floor = styled.div<{ isElevatorHere: boolean }>(
  ({ isElevatorHere }) => `
  border: 1px solid black;
  width: 19px;
  height: 19px;
  background-color: ${isElevatorHere ? "green" : "transparent"};
`,
);
