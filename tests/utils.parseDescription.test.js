const { parseDescription } = require('../utils');

const tests = [
  {
    input: 'the title, the location (© the photographer/the source)',
    output: {
      title: 'the title',
      location: 'the location',
      photographer: 'the photographer',
      source: 'the source',
    },
  },
  {
    input: 'the title, the street, the city, the country (© the photographer/the source)',
    output: {
      title: 'the title',
      location: 'the street, the city, the country',
      photographer: 'the photographer',
      source: 'the source',
    },
  },
  {
    input: 'the title (© the photographer/the source)',
    output: {
      title: 'the title',
      location: '',
      photographer: 'the photographer',
      source: 'the source',
    },
  },
  {
    input: 'the title, the location (© the photographer)',
    output: {
      title: 'the title',
      location: 'the location',
      photographer: 'the photographer',
      source: '',
    },
  },
  {
    input: 'the title, the location (© /the source)',
    output: {
      title: 'the title',
      location: 'the location',
      photographer: '',
      source: 'the source',
    },
  },
];

tests.forEach((test, ind) => {
  const photo = parseDescription(test.input);
  const result = ['title', 'location', 'photographer', 'source'].map(key => photo[key] === test.output[key]);
  console.log(`Test #${ind}: ${result.some(matched => !matched) ? 'FAILED' : 'OK'}`);
});
