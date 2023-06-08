
const getAssets = async () => {

  const manifest = await fetch('https://assets.ateoat.com/manifest.json');
  const data = await manifest.json();

  const { spritesheetHQ, spritesheetMQ, spritesheetLQ, spritesheetPQ } = data.assets;

  const downloadAssetsForSet = (set) => {
  };

  downloadAssetsForSet(spritesheetHQ);
  downloadAssetsForSet(spritesheetMQ);
  downloadAssetsForSet(spritesheetLQ);
  downloadAssetsForSet(spritesheetPQ);
};

getAssets();