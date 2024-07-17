
let api_root=''
console.log('process: ', process.env.BUILD_MODE )
if(process.env.BUILD_MODE === 'dev') {
    api_root = 'http://localhost:8017'
}

if(process.env.BUILD_MODE === 'production') {
    api_root = 'https://web-trello-api-lamjs.onrender.com'
}
console.log("🚀 ~ api_root:", api_root)

export const API_ROOT = api_root
//        https://web-trello-api-lamjs.onrender.com
// http://localhost:8017