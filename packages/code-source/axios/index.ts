(async () => {
    const fetch = require('node-fetch');

    const response = await fetch('http://localhost:9000/list');
    const data = await response.json();
    console.log(data);
})();
