const crypto=require('crypto');
function GenToken(){
    const tokenlength=20
    const bytes=crypto.randomBytes(tokenlength);//generates 20 random bytes
    const token=bytes.toString('hex');//final token assigned after bytes convert to hex string
    return token;
}
module.exports={
    GenToken
};
