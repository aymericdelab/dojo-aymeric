import {useState } from 'react';
import './App.css';
import { useDojo } from './DojoContext';
import { useComponentValue } from "@dojoengine/react";
import { Utils } from '@dojoengine/core';

function App() {
  const {
    systemCalls: { mint_resources, build_labor, harvest_labor },
    components: { Resource, Labor, Vault },
  } = useDojo();

  const [chosenEntityId, setChosenEntityId] = useState<bigint>(BigInt(0));
  const [chosenResourceType, setChosenResourceType] = useState<bigint>(BigInt(1));
  const [inputResourceAmount, setInputResourceAmount] = useState<bigint | null>(null);
  const [inputLaborUnits, setInputLaborUnits] = useState<bigint | null>(null);

  const resource = useComponentValue(Resource, Utils.getEntityIdFromKeys([chosenEntityId, chosenResourceType])); 
  const labor = useComponentValue(Labor, Utils.getEntityIdFromKeys([chosenEntityId, chosenResourceType]));
  const vault = useComponentValue(Vault, Utils.getEntityIdFromKeys([chosenEntityId, chosenResourceType]));

  const handleBuildLabor = async () => {
    // Check if entity_id and resource_type are selected
    if (chosenEntityId !== null && chosenResourceType !== null) {
      try {
        await build_labor({
          realm_id: chosenEntityId,
          resource_type: chosenResourceType,
          labor_units: inputLaborUnits,
          multiplier: 1
        });
        console.log("Build Labor transaction successful");
      } catch (error) {
        console.error("Error building labor:", error);
      }
    } else {
      console.log("Please select an entity and a resource type");
    }
  };

  const handleHarvestLabor = async () => {
    // Check if entity_id and resource_type are selected
    if (chosenEntityId !== null && chosenResourceType !== null) {
      try {
        await harvest_labor({
          realm_id: chosenEntityId,
          resource_type: chosenResourceType
        });
        console.log("Harvest Labor transaction successful");
      } catch (error) {
        console.error("Error harvesting labor:", error);
      }
    } else {
      console.log("Please select an entity and a resource type");
    }
  };

  const handleMintResources = async () => {
    // Check if entity_id and resource_type are selected
    if (typeof chosenEntityId === "bigint" && chosenEntityId >= 0) {
      // Check if resourceAmount is a valid number
      if (typeof inputResourceAmount === "bigint" && inputResourceAmount >= 0) {
        try {
          await mint_resources({
            realm_id: chosenEntityId,
            resource_type: chosenResourceType,
            amount: inputResourceAmount,
          });
          console.log("Mint Resources transaction successful");
        } catch (error) {
          console.error("Error minting resources:", error);
        }
      } else {
        console.log("Please enter a valid amount for minting resources");
      }
    } else {
      console.log("Please select an entity and a resource type");
    }
  };

  const handleEntityIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trim();
    const numericValue = BigInt(inputValue);
    setChosenEntityId(numericValue);
  };

  return (
    <>
<div className="card">
        <input
          type="text"
          placeholder="Enter Entity ID"
          value={chosenEntityId !== null ? chosenEntityId.toString() : ''}
          onChange={handleEntityIdChange}
        />
        <div>Chosen Realm Entity ID: {chosenEntityId !== null ? chosenEntityId.toString() : ''}</div>
      </div>
      <div className="card">
        <select onChange={e => setChosenResourceType(BigInt(e.target.value))}>
          <option value="">Choose Resource Type</option>
          {/* Add options for resource types */}
          {Array.from({ length: 28 }, (_, i) => i + 1).map(resourceType => (
            <option key={resourceType} value={resourceType}>
              {resourceType}
            </option>
          ))}
          <option value="254">254</option>
          <option value="255">255</option>
        </select>
        <div>Resource Type: {chosenResourceType?.toString()}</div>
        <div>Amount: {resource? resource['balance']: 0}</div>
      </div>
      <div className="card">
      <input
          type="number"
          placeholder="Enter amount"
          value={inputResourceAmount? Number(inputResourceAmount): 0}
          onChange={e => setInputResourceAmount(BigInt(e.target.value))}
        />
        <button onClick={handleMintResources}>
          Mint Resource
        </button>
      </div>
      <div className="card">
        <input
          type="number"
          placeholder="Enter amount"
          value={inputLaborUnits? Number(inputLaborUnits): 0}
          onChange={e => setInputLaborUnits(BigInt(e.target.value))}
        />
        <button onClick={handleBuildLabor}>
          Build Labor
        </button>
      </div>
      <div className="card">
        <button onClick={handleHarvestLabor}>
          Harvest Labor
        </button>
      </div>
      <div className="card">
        <div>Amount of Labor: {labor? labor['balance'].toString(): ''}</div>
        <div>Amount in Vault: {vault? vault['balance'].toString(): ''}</div>
        <div>Last Harvested Time: {labor? labor['last_harvest'].toString(): ''}</div>
      </div>
    </>
  );
}

export default App;
