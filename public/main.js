// Function to handle authentication
async function authenticateUser() {
    const login_id = document.getElementById('login_id').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await axios.post(
        'http://localhost:3000/authenticate',
        { login_id, password }
      );
  
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        document.getElementById('authContainer').style.display = 'none';
      
        document.getElementById('showcreatecustomerformbutton').style.display = 'block';
      
        document.getElementById('logout').style.display = 'block';
        getCustomerList();
      }
    } catch (error) {
      
        if(response.status===401){
          alert("authentication failed")
        }
    }
  }
  
  // Function to handle customer creation
  async function createCustomer() {
    document.getElementById('showcreatecustomerformbutton').style.display = 'block';
    document.getElementById('customerContainer').style.display = 'none';
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const street = document.getElementById('street').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(
        'http://localhost:3000/createCustomer',
        {
          first_name: firstName,
          last_name: lastName,
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
  
      if (response.status === 201) {
        alert('Customer created successfully!');
      }
    } catch (error) {
     
        console.log('Error creating customer:', error);
      
    }
    const customerlistcheck=document.getElementById('customerList');
    if(customerlistcheck.style.display==='block'){
      getCustomerList();
    }
  }
  
 
  // Function to get the customer list
  async function getCustomerList() {
    
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.get('http://localhost:3000/getCustomerList', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        const customers = response.data;
        console.log(customers)
        const table = document.createElement('table');
        const tableHeaders = ['First Name', 'Last Name', 'Street', 'Address', 'City', 'State', 'Email', 'Phone', 'Actions'];
        console.log('Before table creation');
        
        const headerRow = document.createElement('tr');
        tableHeaders.forEach((header) => {
          const th = document.createElement('th');
          th.textContent = header;
          headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
  
      
       await customers.forEach((customer) => {
          const row = document.createElement('tr');
          const customerData = [
            customer.first_name,
            customer.last_name,
            customer.street,
            customer.address,
            customer.city,
            customer.state,
            customer.email,
            customer.phone
          ];
          customerData.forEach((data) => {
            const td = document.createElement('td');
            td.textContent = data;
            row.appendChild(td);
          });
  
         
          const updateButton = document.createElement('button');
          updateButton.textContent = 'Update';
          updateButton.onclick = function () {
            showUpdateForm(customer);
          };
          const updateTd = document.createElement('td');
          updateTd.appendChild(updateButton);
          row.appendChild(updateTd);
  
         
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.onclick = function () {
            deleteCustomer(customer.uuid);
          };
          const deleteTd = document.createElement('td');
          deleteTd.appendChild(deleteButton);
          row.appendChild(deleteTd);
  
          table.appendChild(row);
        });
  
        const customerListTable = document.getElementById('customerListTable');
        customerListTable.innerHTML = ''; // Clear existing table data
        customerListTable.appendChild(table);
        document.getElementById('customerList').style.display = 'block';
       

// console.log('After table creation');
      }
    } catch (error) {
      console.log('Error getting customer list:', error);
    }
  } 

  
  // Function to delete a customer
  async function deleteCustomer(customer) {
    const uuid = customer;
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(
        'http://localhost:3000/deleteCustomer',
        { uuid },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.status === 200) {
        alert('Customer deleted successfully!');
      } else if (response.status === 400) {
        alert('Error: UUID not found.');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
    getCustomerList();
  }
  
  // Function to update a customer
  async function updateCustomer() {
   
    const uuid = document.getElementById('update_uuid').value;
    const firstName = document.getElementById('update_first_name').value;
    const lastName = document.getElementById('update_last_name').value;
    const street = document.getElementById('update_street').value;
    const address = document.getElementById('update_address').value;
    const city = document.getElementById('update_city').value;
    const state = document.getElementById('update_state').value;
    const email = document.getElementById('update_email').value;
    const phone = document.getElementById('update_phone').value;
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post(
        'http://localhost:3000/updateCustomer',
        {
          uuid,
          first_name: firstName,
          last_name: lastName,
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
  
      if (response.status === 200) {
        alert('Customer updated successfully!');
      } else if (response.status === 400) {
        alert('Error: Body is Empty.');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
    document.getElementById('updateCustomerForm').style.display='none';
    getCustomerList();
  }
  function showUpdateForm(customer) {
    const updateFormContainer = document.getElementById('updateCustomerForm');
    updateFormContainer.style.display = 'block';
    document.getElementById('customerContainer').style.display='none';

  
    // Populate the form fields with the customer data
    document.getElementById('update_uuid').value = customer.uuid;
    document.getElementById('update_first_name').value = customer.first_name;
    document.getElementById('update_last_name').value = customer.last_name;
    document.getElementById('update_street').value = customer.street;
    document.getElementById('update_address').value = customer.address;
    document.getElementById('update_city').value = customer.city;
    document.getElementById('update_state').value = customer.state;
    document.getElementById('update_email').value = customer.email;
    document.getElementById('update_phone').value = customer.phone;
  }
  function showcreatecustomerform(){
    const updateFormContainer = document.getElementById('updateCustomerForm');
    updateFormContainer.style.display = 'none';
    document.getElementById('customerContainer').style.display='block';
  }
  
  // Function to handle logout
  function logout() {
    localStorage.removeItem('token');
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('customerContainer').style.display = 'none';
    document.getElementById('customerList').style.display = 'none';
    document.getElementById('showcreatecustomerformbutton').style.display = 'none';
        document.getElementById('showgetcustomerlistbutton').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('updateCustomerForm').style.display = 'none';
  }
  