#!/bin/sh
echo "removing helper-bot-ui website files..."
rm -rf /var/www/html/helper/*
if [ $? -eq 0 ]; then
  echo "successfully removed helper-bot-ui website files."
else
  echo "failed to remove helper-bot-ui website files."
fi
