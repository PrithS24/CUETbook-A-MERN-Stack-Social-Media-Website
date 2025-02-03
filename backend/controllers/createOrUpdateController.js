const Bio = require('../model/UserBio')
const User = require('../model/User');
const response = require('../utils/responseHandler');

const createOrUpdateUserBio = async(req,res) =>{
    try {
        const {userId} = req.params;
        const { bioText, liveIn, relationship, workplace, education, phone, hometown}= req.body;

        let bio = await Bio.findOneAndUpdate({user: userId},{
            bioText,
            liveIn,
            relationship,
            workplace,
            education,
            phone,
            hometown
        },{new: true, runValidators: true}
    )
    // if bio does not exist to create new one
    if( !bio ){
        bio = new Bio({
            user: userId,
            bioText,
            liveIn,
            relationship,
            workplace,
            education,
            phone,
            hometown
        })
    }
    await bio.save();
    await User.findByIdAndUpdate(userId,{bio: bio._id})

    return response( res, 201, 'Bio create or update successfully', bio)
    } catch (error) {
        console.log('error getting posts',error)
        return response(res,500,'Internal server error',error.message)
    }
}

module.exports = {
    createOrUpdateUserBio
}