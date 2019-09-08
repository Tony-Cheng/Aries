# Aries
Aries is a messenger designed to reduce toxic behaviour among users. You can read more about it [here](http://aries.tcheng.ca/about).
## Installation
1. Follow the instruction [here](https://github.com/Tony-Cheng/Toxicity-Classification) to create an OpenFaas serverless API for classifying toxic texts.
2. Create a MySQL server and import the model in Aries/server/initialization/aries_mysql.mwb.
3. Create a MongoDB and create a collection called chat_groups. For faster query, appropriate indexes should be added. More details will be provided later. 
4. Go to the folder server. Open the terminal and type the command "npm ci".
5. Run Aries/server/generate_settings.js to generating the settings.json. Then, fill in the appropriate settings in settings.json.
6. Head over to Aries/messenger. Open the terminal and type the command "npm ci"
7. Run "npm run build" to create the production build of the app.
8. Copy the build folder and its contents over to Aries/server.
6. Run Aries/server/build.sh to build the docker image for the server.
7. Deploy the docker image. One way to deploy the docker image is by using Aries/docker/aries.yml, where the MySQL data folder and the MongoDB data folder path need to be specified.
