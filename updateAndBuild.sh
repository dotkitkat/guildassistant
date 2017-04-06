echo "Building Azure..."
echo "Updating Azure..."
sudo git pull
echo "Done."
echo "Compiling.."
sudo tsc -p .
echo "Done."
echo "Moving to build folder.."
cd build
echo "Done."
echo "Running Azure.."
sudo node --harmony index.js