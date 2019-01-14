import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default () => {
  const [secret, setSecret] = useState('');

  const getSecret = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users/secret');
      setSecret(res.data.secret);
    } catch (err) {
      console.error('err', err);
    }
  };

  useEffect(() => { getSecret(); }, []);

  return (
    <div>
      <div> This is a Dashboard component (protected ROUTE) --> Our secret: <b>{secret}</b> </div>
    </div>
  );
}