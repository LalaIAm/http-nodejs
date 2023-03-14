const express = require('express');
const fetch = require('node-fetch');
const PORT = process.env.PORT || 2000

const app = express();

app.use(express.json());

const getProfileInfo = (user_id) => {
  const headers = {
    Authorization: 'Bearer ' + process.env.AUTH_MANAGEMENT_API_TOKEN,
  };
  console.log(headers);
  return fetch(
    'https://' + process.env.AUTH0_DOMAIN + '/api/v2/users/' + user_id,
    { headers: headers }
  ).then((response) => response.json());
};

app.post('/auth0', async (req, res) => {
    const { session_variables } = req.body; 

    const user_id = session_variables['x-hasura-user-id'] 

    return getProfileInfo(user_id).then(function (resp) {
        console.log(resp) 
        if (!resp) {
            return res.status(400).json({
                message: "error happened"
            })
        }
        return res.json({
            email: resp.email,
            picture: resp.picture
        })
    })
})

app.listen(PORT)