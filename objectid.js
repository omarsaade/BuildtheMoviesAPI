/*
_id :5a723823120112ewes21sdsd // 24 chararcteres
every two charac represent a 1 byte
 12 bytes
first 4 bytes     : timestamp , time this document was created
3 bytes: machine identifier // two different machine
2 bytes     : process identifier // generate two object id on the same machine
// but in different processes this two bytes will be different
//
3 bytes     : counter : if u are on the same machine , same process , same second
but genrerate two different documents the counter bytes will be different
so with these 12 bytes we can uniquelly identifie a document in mongodb


 
 */

/*

1 byte = 8 bits // 0 or 1
2 ^ 8 = 256  so with 1 byte we can store 256 different numbers


in 3 bytes = 24bits
2 ^ 24 = 16M

if in same timestamp , same machine , same process we generate more than
16M documents..this counter will overflow and thats were will end with 2 document
with a same object id

Mongo db Driver talks to Mongoose
 id is generated by the driver by 3akes el sql database
driver bya3mul generate la unique identifier using those twelve bytes
objectId is generated by mongodb driver

*/

const mongoose = require("mongoose");
//generate object id
const id = new mongoose.Types.ObjectId();
console.log(id);
console.log(id.getTimestamp());
//static method isValid
const isValid = mongoose.Types.ObjectId.isValid("1234");
console.log(isValid); //false
