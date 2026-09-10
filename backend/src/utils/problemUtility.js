// const axios = require('axios');


// const getLanguageById = (lang)=>{

//     const language = {
//         "c++":54,
//         "java":62,
//         "javascript":63
//     }


//     return language[lang.toLowerCase()];
// }


// const submitBatch = async (submissions)=>{


// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     base64_encoded: 'false'
//   },
//   headers: {
//     'x-rapidapi-key': process.env.JUDGE0_KEY,
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     submissions
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data;
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

//  return await fetchData();

// }


// const waiting = async(timer)=>{
//   setTimeout(()=>{
//     return 1;
//   },timer);
// }

// // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

// const submitToken = async(resultToken)=>{

// const options = {
//   method: 'GET',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     tokens: resultToken.join(","),
//     base64_encoded: 'false',
//     fields: '*'
//   },
//   headers: {
//     'x-rapidapi-key': process.env.JUDGE0_KEY,
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data;
// 	} catch (error) {
// 		console.error(error);
// 	}
// }


// while(true){

//  const result =  await fetchData();

//   const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

//   if(IsResultObtained)
//     return result.submissions;

  
//   await waiting(1000);
// }



// }


// module.exports = {getLanguageById,submitBatch,submitToken};




const axios = require('axios');

const getLanguageById = (lang) => {
    const language = {
        "c": 50,
        "c++": 54,
        "cpp": 54,
        "java": 62,
        "javascript": 63,
        "python": 71
    };

    return language[lang.toLowerCase()] || 63;
};

const encodeBase64 = (str) => {
    if (!str) return '';
    return Buffer.from(str, 'utf-8').toString('base64');
};

const decodeBase64 = (str) => {
    if (!str) return '';
    try {
        return Buffer.from(str, 'base64').toString('utf-8');
    } catch (e) {
        return str;
    }
};

// Submit multiple test cases to YOUR Azure Judge0 with Base64 encoding
const submitBatch = async (submissions) => {
    const encodedSubmissions = submissions.map(sub => ({
        source_code: encodeBase64(sub.source_code),
        language_id: sub.language_id,
        stdin: encodeBase64(sub.stdin),
        expected_output: encodeBase64(sub.expected_output)
    }));

    const options = {
        method: 'POST',
        url: `${process.env.JUDGE0_URL}/submissions/batch`,
        params: {
            base64_encoded: 'true'
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            submissions: encodedSubmissions
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(
            'Judge0 submitBatch error:',
            error.response?.data || error.message
        );
        throw error;
    }
};

// Proper delay function
const waiting = (timer) => {
    return new Promise(resolve => setTimeout(resolve, timer));
};

// Get submission results from YOUR Azure Judge0 with Base64 decoding
const submitToken = async (resultToken) => {
    const options = {
        method: 'GET',
        url: `${process.env.JUDGE0_URL}/submissions/batch`,
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(
                'Judge0 submitToken error:',
                error.response?.data || error.message
            );
            throw error;
        }
    };

    while (true) {
        const result = await fetchData();

        const isResultObtained = result.submissions.every((r) => r.status_id > 2);

        if (isResultObtained) {
            return result.submissions.map(sub => ({
                ...sub,
                stdin: decodeBase64(sub.stdin),
                expected_output: decodeBase64(sub.expected_output),
                stdout: decodeBase64(sub.stdout),
                stderr: decodeBase64(sub.stderr),
                compile_output: decodeBase64(sub.compile_output),
                message: decodeBase64(sub.message)
            }));
        }

        await waiting(1000);
    }
};

module.exports = {
    getLanguageById,
    submitBatch,
    submitToken
};


