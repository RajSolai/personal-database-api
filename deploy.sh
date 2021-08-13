echo "Compiling the App"
yarn build
echo "Pushing to Cloud"
ibmcloud cf push
