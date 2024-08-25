const axios = require('axios');
const fs = require('fs');

function extractData(name, original_data) {
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
            breakdown['indicator_' + indicator['nameEn']] = item['indData'][indicator['code']]
        })
        return {
            name: item['univNameEn'].replace(/,/g, ' -'),
            code: item['univUp'].replace(/,/g, ' -'),
            logo: item['univLogo'],
            rank: item['ranking'],
            region: item['region'],
            region_code: item['regionLogo'],
            region_ranking: item['regionRanking'],
            score: item['score'],
            ...breakdown
        }
    });
    const csv = data.map((item) => {
        return [
            item['name'],
            item['code'],
            item['logo'],
            item['rank'],
            item['region'],
            item['region_code'],
            item['region_ranking'],
            item['score'],
            ...Object.keys(indicators).map((key) => item['indicator_' + indicators[key]['nameEn']])
        ].join(',');
    });
    const header = Object.keys(data[0]).join(',');
    fs.writeFileSync(
        `./data/csv/${year}.csv`,
        header + '\n' + csv.join('\n')
    )
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