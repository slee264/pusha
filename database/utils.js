import { ObjectId } from 'mongodb';

function objectID(_id){
  try{
    const objID = new ObjectId(_id);
    return objID;
  }catch(err){
    return err;
  }
}

export { objectID };