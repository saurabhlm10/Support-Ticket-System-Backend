const upstashRedRESTUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const axios = require('axios')

exports.fetchRedis = async (command, ...args) => {
    const commandUrl = `${upstashRedRESTUrl}/${command}/${args.join("/")}`;

    // return console.log(commandUrl)

    const response = await axios.get(commandUrl, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        }
    })

    if (response.statusText !== 'OK') {
        throw new Error(`Error executing Redis command: ${response.statusText}`);
    }

    if (command === 'zadd') return

    const data = await response.json();

    return data.result;
}
