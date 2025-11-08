const { parseEventDate, categorizeEventByDate, isRecurringEvent } = require('./server/dateUtils.ts');

console.log('=== Date Parsing and Categorization Tests ===\n');

const testCases = [
  {
    description: 'Future date (March 15, 2025)',
    date: 'March 15, 2025',
    isRecurring: false,
    expected: 'upcoming'
  },
  {
    description: 'Past date (May 7, 2023)',
    date: 'May 7, 2023',
    isRecurring: false,
    expected: 'past'
  },
  {
    description: 'Recurring event (Every Tuesday)',
    date: 'Every Tuesday',
    isRecurring: true,
    expected: 'upcoming'
  },
  {
    description: 'Recurring event (Every Friday)',
    date: 'Every Friday',
    isRecurring: true,
    expected: 'upcoming'
  },
  {
    description: 'MM/DD/YYYY format past date (11/11/2023)',
    date: '11/11/2023',
    isRecurring: false,
    expected: 'past'
  },
  {
    description: 'ISO format past date (2023-02-18)',
    date: '2023-02-18',
    isRecurring: false,
    expected: 'past'
  },
  {
    description: 'Month DD, YYYY format future (February 20, 2025)',
    date: 'February 20, 2025',
    isRecurring: false,
    expected: 'upcoming'
  }
];

let passCount = 0;
let failCount = 0;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.description}`);
  console.log(`  Input: "${testCase.date}", isRecurring: ${testCase.isRecurring}`);

  const parsedDate = parseEventDate(testCase.date);
  if (parsedDate) {
    console.log(`  Parsed Date: ${parsedDate.toDateString()}`);
  } else {
    console.log(`  Parsed Date: null (likely recurring pattern)`);
  }

  const category = categorizeEventByDate(testCase.date, testCase.isRecurring);
  console.log(`  Expected: ${testCase.expected}`);
  console.log(`  Got: ${category}`);

  const isRecurring = isRecurringEvent(testCase.date);
  console.log(`  Detected as recurring: ${isRecurring}`);

  if (category === testCase.expected) {
    console.log('  ✅ PASS\n');
    passCount++;
  } else {
    console.log('  ❌ FAIL\n');
    failCount++;
  }
});

console.log('=== Test Summary ===');
console.log(`Total Tests: ${testCases.length}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log(`Success Rate: ${((passCount / testCases.length) * 100).toFixed(1)}%`);
