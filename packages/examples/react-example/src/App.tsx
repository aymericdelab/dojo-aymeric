import { useEffect, useState } from 'react';
import './App.css';
import { useDojo } from './DojoContext';
import { useComponentValue, getEntityIdFromQuery } from "@dojoengine/react";
import { Query } from '@dojoengine/core';
import { EntityIndex, setComponent } from '@latticexyz/recs';

function App() {
  const {
    systemCalls: { mint_resources, build_labor, harvest_labor },
    components: { Resource, Labor, Vault },
    network: { world, signer, entity }
  } = useDojo();

  // let resource_id = 1;
  const resourceQuery1 = { address_domain: "0", partition: "0", keys: [BigInt(0), BigInt(1)] };
  const resourceQuery2 = { address_domain: "0", partition: "0", keys: [BigInt(0), BigInt(2)] };
  const entityId1 =  getEntityIdFromQuery(resourceQuery1);
  const entityId2 =  getEntityIdFromQuery(resourceQuery2);
  // TODO: do we have to do that? 
  // but we could also just use entityID from the pedersen hash of the query, same as in dojo
  const entityIndex1 = world.registerEntity({id: entityId1})
  const entityIndex2 = world.registerEntity({id: entityId2})

  // TODO: get entity from query
  // const resource = useComponentValue(Resource, entityIndex);
  const resource1 = useComponentValue(Resource,  entityIndex1);
  const resource2 = useComponentValue(Resource,  entityIndex2);
  console.log('resource1');
  console.log(resource1);
  console.log('resource2');
  console.log(resource2);

  const [chosenEntityId, setChosenEntityId] = useState<bigint | null>(null);
  const [chosenResourceType, setChosenResourceType] = useState<bigint | null>(null);
  const [resourceAmount, setResourceAmount] = useState<bigint | null>(null);
  const [inputResourceAmount, setInputResourceAmount] = useState<bigint | null>(null);
  const [laborAmount, setLaborAmount] = useState<bigint | null>(null);
  const [inputLaborUnits, setInputLaborUnits] = useState<bigint | null>(null);
  const [vaultBalance, setVaultBalance] = useState<bigint | null>(null);
  const [lastHarvestTime, setLastHarvestTime] = useState<bigint | null>(null);

  // const testResourceHook = useComponentValue() 

  // address_domain and partition always 0
  // const query: Query = { address_domain: "0", partition: "0", keys: [BigInt(signer.address)] };

  // async function getEntity() {
  //   try {
  //     const va = await entity(Position.metadata.name, query);
  //     return va;
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     console.log('done');
  //   }
  // }

  // useEffect(() => {
  //   getEntity().then(va => console.log(va));
  // }, []);

  useEffect(() => {
    // Update information related to the currently selected resource type
    if (chosenEntityId !== null && chosenResourceType !== null) {
      // Perform queries for Labor and Vault with the chosen entity_id and resource_type
      const laborQuery: Query = { address_domain: "0", partition: "0", keys: [chosenEntityId, chosenResourceType] };
      const vaultQuery: Query = { address_domain: "0", partition: "0", keys: [chosenEntityId, chosenResourceType] };
      const resourceQuery: Query = { address_domain: "0", partition: "0", keys: [chosenEntityId, chosenResourceType] };

      entity(Labor.metadata.name, laborQuery)
        .then(laborData => {
          const [_, balance, lastHarvest, multiplier] = laborData;
          setLaborAmount(balance);
          setLastHarvestTime(lastHarvest);
        })
        .catch(error => {
          console.error("Error retrieving labor information:", error);
        });

      entity(Vault.metadata.name, vaultQuery)
        .then(vaultData => {
          const [_, balance] = vaultData;
          setVaultBalance(balance);
        })
        .catch(error => {
          console.error("Error retrieving vault information:", error);
        });

      entity(Resource.metadata.name, resourceQuery)
        .then(resourceData => {
          const [_, resource_type, amount] = resourceData;
          console.log("Resource type:", resource_type);
          console.log("Amount:", amount)
          setResourceAmount(amount);
        })
        .catch(error => {
          console.error("Error retrieving vault information:", error);
        });
    }
  }, [chosenEntityId, chosenResourceType]);

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
    // you can set it multiple times it will only update the last one
    setComponent(Resource, entityIndex1, {resource_type: 1000, balance: 1000})
    setComponent(Resource, entityIndex2, {resource_type: 1110, balance: 2999})
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
        <div>Amount: {resourceAmount?.toString()}</div>
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
        <div>Amount of Labor: {laborAmount?.toString()}</div>
        <div>Amount in Vault: {vaultBalance?.toString()}</div>
        <div>Last Harvested Time: {lastHarvestTime?.toString()}</div>
      </div>
    </>
  );
}

export default App;
