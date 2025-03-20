#!/bin/bash

echo "Waiting for ACA-Py to start..."
# Wait longer - 30 seconds instead of 10
echo "Waiting 30 seconds for ACA-Py to fully initialize..."
sleep 30

# Check if agent is responsive
echo "Checking if ACA-Py agent is responsive..."
AGENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8010/status)

if [ "$AGENT_STATUS" != "200" ]; then
  echo "ACA-Py agent is not responding correctly. Status code: $AGENT_STATUS"
  echo "Checking agent logs..."
  docker-compose logs --tail=50 aries-agent
  exit 1
fi

echo "ACA-Py agent is responsive. Checking existing DIDs..."
EXISTING_DIDS=$(curl -s -X GET http://localhost:8010/wallet/did)
echo "Existing DIDs: $EXISTING_DIDS"

# Try to create a new DID with the Steward seed
echo "Creating DID with Steward seed..."
DID_RESPONSE=$(curl -s -X POST http://localhost:8010/wallet/did/create \
  -H "Content-Type: application/json" \
  -d '{
    "method": "sov", 
    "options": {
      "seed": "000000000000000000000000Steward1",
      "key_type": "ed25519"
    }
  }')

echo "DID creation response: $DID_RESPONSE"

# Extract DID from response using a more robust approach with jq if available
if command -v jq &> /dev/null; then
  NEW_DID=$(echo $DID_RESPONSE | jq -r '.result.did // empty')
else
  NEW_DID=$(echo $DID_RESPONSE | grep -o '"did":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$NEW_DID" ]; then
  echo "Failed to extract DID from response."
  echo "Trying alternate approach - fetch existing DIDs and use the first one..."
  
  if command -v jq &> /dev/null; then
    NEW_DID=$(echo $EXISTING_DIDS | jq -r '.results[0].did // empty')
  else
    NEW_DID=$(echo $EXISTING_DIDS | grep -o '"did":"[^"]*' | head -1 | cut -d'"' -f4)
  fi
  
  if [ -z "$NEW_DID" ]; then
    echo "No existing DIDs found. Setup failed."
    exit 1
  fi
  
  echo "Using existing DID: $NEW_DID"
fi

# Set the DID as public
echo "Setting DID as public..."
PUBLIC_RESPONSE=$(curl -s -X POST http://localhost:8010/wallet/did/public \
  -H "Content-Type: application/json" \
  -d "{\"did\": \"$NEW_DID\"}")

echo "Public DID response: $PUBLIC_RESPONSE"

# Verify public DID is set
echo "Verifying public DID..."
PUBLIC_DID_CHECK=$(curl -s -X GET http://localhost:8010/wallet/did/public)
echo "Public DID: $PUBLIC_DID_CHECK"

# Test creating a schema
echo "Testing schema creation..."
SCHEMA_RESPONSE=$(curl -s -X POST http://localhost:8010/schemas \
  -H "Content-Type: application/json" \
  -d '{
    "schema_name": "degree",
    "schema_version": "1.0",
    "attributes": ["name", "degree_name", "year", "grade"]
  }')

echo "Schema creation response: $SCHEMA_RESPONSE"

# Test the Ethereum bridge directly
echo "Testing Ethereum bridge directly..."
BRIDGE_RESPONSE=$(curl -s -X POST http://localhost:3000/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "issue_credential",
    "state": "credential_issued",
    "credential_exchange_id": "test-credential-123",
    "schema_id": "test-schema-id"
  }')

echo "Bridge webhook response: $BRIDGE_RESPONSE"
echo "Check docker-compose logs ethereum-bridge for more details"