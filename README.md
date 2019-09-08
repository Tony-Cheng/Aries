# Aries
Aries is a messenger designed to reduce toxic behaviour among users. You can read more about it [here](http://aries.tcheng.ca/about).
## Installation
1. Follow the instruction [here](https://github.com/Tony-Cheng/Toxicity-Classification) to create an OpenFaas serverless API for classifying toxic texts.
2. Go to the folder server. Open the terminal and type the command "npm ci".
3. Create a file called setting.json, which should be in the following format:
{
    "mysql": {
        "host": "",
        "user": "",
        "password": "",
        "database": "Aries"
    }
}.
