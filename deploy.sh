#!/bin/bash
git add .
git commit -m "comit coucou"
git push
npm run deploy
echo "Deployé, n'oublie pas de mettre à jour le Custom domain dans GH Pages : (tri-cartes.sophieluksenberg.fr)"

