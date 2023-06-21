const fs = require('fs-extra');

const getData = async () => {
  try {
    const data = await fetch('https://content.ateoat.com/content.json');
    const json = await data.json();

    fs.writeJsonSync('./content.json', json);

    console.log('Data fetched and saved to ./content.json');
  } catch (e) {
    console.error(e);
  }
};

getData();