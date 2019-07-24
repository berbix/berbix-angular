#!/bin/bash

set -ex

VERSION=$(cat version)

sed -i "" -e "s/const SDK_VERSION = '[[:digit:]]*\.[[:digit:]]*\.[[:digit:]]*';/const SDK_VERSION = '$VERSION';/g" projects/berbix/src/lib/berbix.component.ts
sed -i "" -e "s/  \"version\": \"[[:digit:]]*\.[[:digit:]]*\.[[:digit:]]*\",/  \"version\": \"$VERSION\",/g" projects/berbix/package.json

git add projects/berbix/src/lib/berbix.component.ts projects/berbix/package.json version
git commit -m "Updating Berbix Angular SDK version to $VERSION"
git tag -a $VERSION -m "Version $VERSION"
git push --follow-tags

ng build
cd dist/berbix
npm publish
