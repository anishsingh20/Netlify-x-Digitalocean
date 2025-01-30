const { MongoClient } = require('mongodb');  

// Connect to DigitalOcean Managed MongoDB  
const uri = process.env.MONGODB_URI;  

exports.handler = async (event, context) => {  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });  

  try {  
    await client.connect();  
    const db = client.db('messages_db');  
    const collection = db.collection('messages');  

    // Insert a sample message if empty  
    if (event.httpMethod === 'POST') {  
      const { text } = JSON.parse(event.body);  
      await collection.insertOne({ text, timestamp: new Date() });  
      return { statusCode: 201, body: 'Message added!' };  
    }  

    // Fetch all messages  
    const messages = await collection.find().sort({ timestamp: -1 }).toArray();  
    return { statusCode: 200, body: JSON.stringify(messages) };  

  } catch (err) {  
    return { statusCode: 500, body: `Error: ${err.message}` };  
  } finally {  
    await client.close();  
  }  
};  