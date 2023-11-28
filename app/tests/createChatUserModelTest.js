const ChatUserModel = require('../models/chatUserModel');
const CompanyModel = require('../models/companyModel');

async function createUser() {
  try {
    const newCompany = new CompanyModel({
      name: 'Plasma',
    });
    const savedCompany = await newCompany.save();

    const newUser = new ChatUserModel({
      name: 'Deivid',
      password: '123',
      userId: 1,
      companyId: savedCompany._id, 
    });

    const newUser2 = new ChatUserModel({
      name: 'Rafael',
      password: '123',
      userId: 2,
      companyId: savedCompany._id, 
    });

    const newUser3 = new ChatUserModel({
      name: 'Livia',
      password: '123',
      userId: 3,
      companyId: savedCompany._id, 
    });

    const savedUser = await newUser.save();
    const savedUser2 = await newUser2.save();
    const savedUser3 = await newUser3.save();

    console.log('User created successfully:', savedUser, savedUser2, savedUser3);
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
}

createUser();
