const user = require('../controllers/user');

const limitedAccess = (req, res, next) => {

    //client
    if(!req.user_role || req.user_role==0){
        console.log("access not granted");
        return res.status(401).end();
    }

    //employee
    if(req.user_role==1 && req.params.hotelid){
        user.findAllWorkStations(req.user_id).then((work) => {

            console.log(work);

            if(work.length==0){
                console.log("access not granted");
                return res.status(401).end();
            }

            for(let i=0;i<work.length;i++){

                if(work[i].hotel==req.params.hotelid){
                    console.log("access granted");
                    return next();
                }

            }

            console.log("access not granted");
            return res.status(401).end();


        }).catch((err) => {
            console.log("access not granted");
            console.log(err);
            return res.status(401).end();
        });
    }

    //admin
    if(req.user_role==2){
        console.log("access granted");
        return next();
    }

}

const onlyAdmin = (req, res, next) => { 

    if(!req.user_role || req.user_role!=2){
        console.log("access not granted");
        return res.status(401).end();
    } 
    
    console.log("access granted");
    return next();

}

module.exports = {limitedAccess, onlyAdmin};