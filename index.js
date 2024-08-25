const axios = require('axios');
const fs = require('fs');

function extractData(name, original_data) {

    console.log(name);
    const year = name.match(/\d+/g)[0];

    fs.writeFileSync(
        `./data/uncensored/${year}.json`,
        JSON.stringify(original_data, null, 2)
    )


    const indicators = original_data['data'][0]['indList'];
    let data = original_data['data'][0]['univList']
    data = data.map((item) => {
        const breakdown = {}
        indicators.forEach((indicator) => {
            breakdown[indicator['nameEn']] = item['indData'][indicator['code']]
        })
        return {
            name: item['univNameEn'],
            code: item['univUp'],
            logo: item['univLogo'],
            rank: item['ranking'],
            region: item['region'],
            region_code: item['regionLogo'],
            region_ranking: item['regionRanking'],
            score: item['score'],
            breakdown
        }
    });    
    fs.writeFileSync(`./data/${year}.json`, JSON.stringify(data, null, 2));

}
async function main() {
    for (let year = 2003; year <= 2024; year++) {
        const link = `https://www.shanghairanking.com/_nuxt/static/1724403184/rankings/arwu/${year}/payload.js`;
        const file = await axios.get(link);
        const data = file.data;
        const newData = data.replace(/__NUXT_JSONP__/g, 'extractData');
        eval(newData);
    }
}
main();