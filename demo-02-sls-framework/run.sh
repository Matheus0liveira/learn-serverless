# install 
npm install -g serverless

# Init
sls

# always deploy first to check that everything is okay
sls deploy

# invoke in AWS
sls invoke -f hello

# invoke in local
sls invoke local -f hello --verbose

# configure dashboard