# Demo for creating a visual regression test suite in create-react-app

See [this Medium article](TODO) for more information

## How it works

- The set up is a simple web app using `create-react-app` and nothing much else.
- [TestCafe](https://devexpress.github.io/testcafe/) and [Resemblejs](https://github.com/rsmbl/Resemble.js) have been imported as devDependencies (along with `path` and `fs-extra`)
- There is a TestCafe test script in our `package.json` to run TestCafe

  - `npm run test` => `testcafe firefox:headless -s ./tests/vrt-screenshots ./tests/*visual.test.js`

## Visual regression processing

- `npm run test` is called (requires the server to be already started using `npm start`)
- `tests/App.visual.test.js` navigates to the homepage and calls `tests/vrt-util/vrtUtil.js` exported function `doVisualRegression(testFixture, testName)`
- `doVisualRegression(..)` takes the screenshots and stores them in an `actual` and `base` folder (if no base screenshot exists.
- If an `actual` and `base` screenshot exists, perform the comparison using Resemblejs. If the comparison detects a mismatch, fail the test and output a diff image in the `actual` folder.
