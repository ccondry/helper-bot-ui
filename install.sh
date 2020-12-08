#!/bin/sh
echo "running yarn"
yarn
if [ $? -eq 0 ]; then
  echo "running yarn build..."
  yarn build
  while [ $? != 0 ]
  do
    echo "failed to build helper-bot-ui website files. trying again..."
    yarn build
  done
  echo "yarn build successful. copying dist files to www folder..."
  mkdir -p /var/www/html/helper
  cp -rf dist/* /var/www/html/helper/
  if [ $? -eq 0 ]; then
    echo "successfully installed helper-bot-ui website files"
  else
    echo "failed to install helper-bot-ui website files"
  fi
else
  echo "yarn failed"
fi
