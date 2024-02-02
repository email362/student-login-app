#!/bin/bash

echo "Starting backend development servers..."

# Start local mongodb
echo "Starting local mongodb..."
osascript -e 'tell app "Terminal" to do script "brew services start mongodb-community@7.0"'
echo "Local mongodb started."
# wait for mongodb to start
sleep 5

# Start the first server in a new Terminal window
echo "Starting api server..."
osascript -e 'tell app "Terminal" to do script "cd ~/mlc-project/student-login-app/ && npm run dev"'
echo "Api server started."
# wait for api server to start
sleep 5

# Start the second server in another new Terminal window
echo "Starting admin client..."
osascript -e 'tell app "Terminal" to do script "cd ~/mlc-project/student-login-app/ && npm run dev-admin"'
echo "Admin client started."
# wait for admin client to start
sleep 5

echo "Development servers started in separate terminal windows."
