#!/bin/sh

# If a command fails then halt the deployment
set -e

printf "\033[0;32mDeploying updates for $1 ...\033[0m\n"

# # Go to project dir
cd dist-$1

# # Add changes to git.
git add .

# # Commit changes.
git commit -m "Updating game $1 $(date)"

# # Push source and build repos.
git push origin +main