import { EntityID, EntityIndex } from "@latticexyz/recs";
import { Query } from '@dojoengine/core'

export const getEntityIdFromQuery = (query: Query): EntityID => {
    // Perform the necessary logic to find the entity based on the query
    // ...
    let entityId: string = '';
    for (const key of query.keys) {
        entityId += key.toString() + '-';
    }
  
    // For the sake of this example, let's assume we found the entity and assign it to an entityIndex variable
  
    return entityId as EntityID;
  }