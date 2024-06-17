const { parseStockDetail } = require("../utils");

const tests = [
  {
    input:
      "  69.51 +0.10 (+0.14%) At close: April 18 at 4:00 PM EDT    69.06 -0.45 (-0.65%) After hours: April 18 at 7:59 PM EDT    ",
    output: {
      change: "+0.10",
      changePercentage: "+0.14",
    },
  },
  {
    input: "  95.79 +0.17 (+0.18%) At close: April 18 at 4:00 PM EDT     ",
    output: {
      change: "+0.17",
      changePercentage: "+0.18",
    },
  },
];

tests.forEach((test, ind) => {
  const data = parseStockDetail(test.input);
  const result = ["price", "change", "changePercentage"].map(
    (key) => data[key] === test.output[key]
  );
  console.log(
    `Test #${ind}: ${result.some((matched) => !matched) ? "FAILED" : "OK"}`
  );
});
