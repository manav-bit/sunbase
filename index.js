const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path=require('path')
const app = express();
app.use(bodyParser.json());
app.use(cors());

const authenticationAPI = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';
const customerAPI = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/public/main.html');
})
// Route for authenticating the user and getting the bearer token
app.post('/authenticate', async (req, res) => {
  try {
    const { login_id, password } = req.body;
    const response = await axios.post(authenticationAPI, { login_id, password });
    // console.log(response.data.access_token)
    res.json({ token: response.data.access_token});
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Route for creating a new customer
app.post('/createCustomer', async (req, res) => {
  try {
    const { first_name, last_name, street, address, city, state, email, phone } = req.body;
    const token = req.header('Authorization').replace('Bearer ', '');

    const response = await axios.post(
      `${customerAPI}?cmd=create`,
      {
        first_name,
        last_name,
        street,
        address,
        city,
        state,
        email,
        phone
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    res.status(response.status).json({ message: response.statusText });
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data });
  }
});

// Route for getting the customer list
app.get('/getCustomerList', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const response = await axios.get(`${customerAPI}?cmd=get_customer_list`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data });
  }
});

// Route for deleting a customer
app.post('/deleteCustomer', async (req, res) => {
  try {
    const { uuid } = req.body;
    const token = req.header('Authorization').replace('Bearer ', '');

    const response = await axios.post(
      `${customerAPI}?cmd=delete&uuid=${uuid}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    res.status(response.status).json({ message: response.statusText });
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data });
  }
});

// Route for updating a customer
app.post('/updateCustomer', async (req, res) => {
  try {
    const { uuid, first_name, last_name, street, address, city, state, email, phone } = req.body;
    const token = req.header('Authorization').replace('Bearer ', '');

    const response = await axios.post(
      `${customerAPI}?cmd=update&uuid=${uuid}`,
      {
        first_name,
        last_name,
        street,
        address,
        city,
        state,
        email,
        phone
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    res.status(response.status).json({ message: response.statusText });
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
