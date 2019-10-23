#!/bin/bash
set -e

# version analysis
VERSION=`git tag --contains | head -1`

if test -z "$VERSION" 
then
      VERSION="DEVELOPMENT"
else
      npm version $VERSION
fi

# generate version properties
VERSION_PROPS=version.properties

git log -n 1 --pretty=format:revision=%H%n > $VERSION_PROPS
git log -n 1 --pretty=format:revisionAbbrev=%h%n >> $VERSION_PROPS
git log -n 1 --pretty=format:releaseTime=%cI%n >> $VERSION_PROPS
echo "version=$VERSION" >> $VERSION_PROPS


