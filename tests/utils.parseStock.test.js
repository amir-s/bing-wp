const { parseStockDetail } = require('../utils');

const tests = [
  {
    input: '409.15 -0.54 (0.13%)SHOP(TSE)Jun. 14, 4:00 p.m. EDT � Currency in CAD � Disclaimer',
    output: {
      symbol: 'SHOP',
      market: 'TSE',
      price: '409.15',
      change: '-0.54',
      changePercentage: '0.13',
      currency: 'CAD',
    },
  },
  {
    input:
      '305.11 -1.88 (0.61%)After hours: 305.20 +0.09 (0.03%)SHOP(NYSE)Jun. 14, 4:02 p.m. EDT � Currency in USD � Disclaimer',
    output: {
      symbol: 'SHOP',
      market: 'NYSE',
      price: '305.11',
      change: '-1.88',
      changePercentage: '0.61',
      currency: 'USD',
    },
  },
  {
    input: '2,886.98 -4.66 (0.16%).INX(INDEXSP)Jun. 14, 5:14 p.m. EDT � Disclaimer',
    output: {
      symbol: '.INX',
      market: 'INDEXSP',
      price: '2,886.98',
      change: '-4.66',
      changePercentage: '0.16',
      currency: null,
    },
  },
];

tests.forEach((test, ind) => {
  const data = parseStockDetail(test.input);
  const result = ['symbol', 'market', 'price', 'change', 'changePercentage', 'currency'].map(
    key => data[key] === test.output[key]
  );
  console.log(`Test #${ind}: ${result.some(matched => !matched) ? 'FAILED' : 'OK'}`);
});
