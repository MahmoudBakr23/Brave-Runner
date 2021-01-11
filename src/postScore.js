const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api';
const apiKey = '37Fz5s5O6RE1untiAU8M';

export const postScore = async function (name, score) {
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
