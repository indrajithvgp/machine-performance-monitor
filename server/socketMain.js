const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/perfData', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true

})

const Machine = require('./model/Machine.js')

function socketMain(io, socket){
    let macA;
    socket.on('clientAuth', ()=>{
        if(key === ''){

        }else if(key === ''){

        }else{

        }
    })

    socket.on('initPerfData', async(data)=>{
        macA = data.macA
        const mongooseResponse = await checkAndAdd(data);
        console.log(mongooseResponse);
    })

    socket.on('perfData', (data) => {
        // console.log(allPerformanceData)
        io.to('ui').emit('data', data)
    })
}

module.exports = socketMain

function checkAndAdd(data){
    return new Promise((resolve, reject)=>{
        Machine.findOne(
            {macA: data.macA},
            (err,doc)=>{
                if(err){
                    throw err;
                    reject(err);
                }else if(doc === null){
                    let newMachine = new Machine(data);
                    newMachine.save(); 
                    resolve('added')
                }else{
                    resolve('found');
                }
            }
        )
    });
}