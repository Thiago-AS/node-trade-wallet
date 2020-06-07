const baseUrl = "https://finnhub.io/api/v1";
const token = `&token=${process.env.FINHUB_TOKEN}`;
module.exports = {
    companyProfileURL(symbol) {
        return `${baseUrl}/stock/profile2?symbol=${symbol}${token}`;
    }
};