const upstashRedRESTUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const axios = require('axios')

// type Command = "zrange" | "sismember" | "get" | "smembers";

// async function fetchRedis(
//     command,
//     ...args
// ) {


// }

exports.fetchRedis = async (command, ...args) => {
    const commandUrl = `${upstashRedRESTUrl}/${command}/${args.join("/")}`;

    console.log(args)
    console.log(commandUrl)

    const response = await axios.post(commandUrl, {}, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })

    // const response = await fetch(commandUrl, {
    //     headers: {
    //         Authorization: `Bearer ${authToken}`,
    //     }
    // });

    if (!response.ok) {
        throw new Error(`Error executing Redis command: ${response.statusText}`);
    }

    const data = await response.json();

    // console.log(data)

    return data.result;
}

// module.exports = fetchRedis