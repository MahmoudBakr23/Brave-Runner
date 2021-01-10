const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api';
const apiKey = 'Zl4d7IVkemOTTVg2fUdz';

const postScore = async (name, score) => {
  const response = await fetch(`${url}/games/${apiKey}/scores`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'Application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: name, score: Number(score) }),
  });
  if (response.ok) {
    const result = await response.json();
    return result;
  }
  throw new Error('Error!');
};

module.exports = postScore;