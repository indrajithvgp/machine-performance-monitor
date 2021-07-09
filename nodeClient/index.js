const os = require('os')
const io = require('socket.io-client')
let socket = io('http://127.0.0.1:8181')

socket.on('connect', ()=>{
    console.log('I connected to the server')
    let nI = os.networkInterfaces()
    let macA;
    for(let key in nI){
        if(!nI[key][0].internal){
            macA = nI[key][0].mac
            break
        }
    }

    performanceData().then((allPerformanceData) => {
        allPerformanceData.macA = macA
        socket.emit('initPerfData', allPerformanceData)
    })
    


    let perfDataInterval = setInterval(()=>{
        performanceData().then((allPerformanceData) => {
            socket.emit('perfData', allPerformanceData)
        })
    }, 1000)

    socket.on('disconnect', () =>{
        clearInterval(perfDataInterval)
    })

})

function performanceData(){
    return new Promise(async function(resolve, reject){
        const cpus = os.cpus()
        const osType = os.type() === 'Darwin' ? 'Mac' : os.type()
        const upTime = os.uptime()
        const freeMem = os.freemem()
        const totalMem = os.totalmem()
        const usedMem = totalMem - freeMem
        const memUsage = Math.floor(usedMem /totalMem*100)/ 100
        const cpuModel = cpus[0].model
        const cores = cpus.length
        const cpuSpeed = cpus[0].speed
        const cpuLoad = await getCpuLoad()
        resolve({
            cpuModel,
            osType,
            upTime,
            cores,
            cpuAverage,
            cpuSpeed,
            cpuLoad,
            freeMem,
            memUsage,
            usedMem,
            totalMem,
        })
    })
}


// console.log(upTime, freeMem, totalMem, usedMem, cpuModel, cores, cpuSpeed)
function cpuAverage(){
    const cpus = os.cpus()
    let idleMs = 0
    let totalMs = 0
    cpus.forEach((aCore)=>{
        for(type in aCore.times){
            totalMs += aCore.times[type]
        }
        idleMs += aCore.times.idle
    })
    return {
        idle: idleMs/cpus.length,
        total: totalMs/cpus.length
    }
}

// let x = cpuAverage()
// console.log(x)

function getCpuLoad(){
    return new Promise(function(resolve, reject){
        const start = cpuAverage()
        setTimeout(() =>{
            const end = cpuAverage()
            const idleDifference = end.idle - start.idle
            const totalDifference = end.total - start.total
            const percentageCpu = 100 - Math.floor(100* idleDifference/totalDifference)
            resolve(percentageCpu)
        },100)
    })
}

// performanceData().then((bigObj)=>console.log(bigObj))