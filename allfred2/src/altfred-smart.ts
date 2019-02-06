var rp = require('request-promise');

export default async function callBot(message: string): Promise<any> {
  let options = {
    method: 'POST',
    uri: 'http://54.146.212.26:8000/bot/',
    body: {
      message
    },
    json: true // Automatically stringifies the body to JSON
  };

  return rp(options)
}