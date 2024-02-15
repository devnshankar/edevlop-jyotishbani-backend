#!/bin/sh

# Function to check if port 8080 is live
check_port() {
    nc -z localhost 3000
}

# Loop until port 8080 is live
while ! check_port; do
    echo "Waiting for port 3000 to become live..."
    sleep 2
done

# Port 8080 is live, execute the ngrok command
echo "Port 3000 is live! Executing ngrok command..." 
./ngrok/ngrok http http://localhost:3000 --domain=grouper-supreme-easily.ngrok-free.app
