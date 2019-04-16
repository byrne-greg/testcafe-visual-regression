// import uaParser from 'ua-parser-js';
import { t } from "testcafe";
import resemble from "resemblejs";
import path from "path";
import fs from "fs-extra";

const getAbsolutePathForScreenshot = (type, testFixture, testName) =>
  path
    .join(
      __dirname,
      "../vrt-screenshots/",
      type,
      testFixture,
      `${testName}.png`
    )
    .normalize();

const doVisualRegression = async (testFixture, testName) => {
  // take actual screenshot
  await t.takeScreenshot(path.join("actual", testFixture, `${testName}.png`));

  const actualScreenshotAbsolutePath = getAbsolutePathForScreenshot(
    "actual",
    testFixture,
    testName
  );
  const isActualScreenshotTaken = fs.existsSync(actualScreenshotAbsolutePath);

  const baseScreenshotAbsolutePath = getAbsolutePathForScreenshot(
    "base",
    testFixture,
    testName
  );
  const isBaseScreenshotTaken = fs.existsSync(baseScreenshotAbsolutePath);

  if (isActualScreenshotTaken && isBaseScreenshotTaken) {
    await resemble(baseScreenshotAbsolutePath)
      .compareTo(actualScreenshotAbsolutePath)
      .scaleToSameSize()
      .outputSettings({
        errorColor: {
          red: 255,
          green: 0,
          blue: 255
        },
        errorType: "movement",
        transparency: 0.3,
        largeImageThreshold: 1200,
        useCrossOrigin: false,
        outputDiff: true
      })
      .onComplete(async data => {
        if (data.rawMisMatchPercentage > 0) {
          // write a diff image
          fs.writeFileSync(
            path.join(
              path.dirname(actualScreenshotAbsolutePath),
              `${path.basename(
                actualScreenshotAbsolutePath,
                path.extname(actualScreenshotAbsolutePath)
              )}-diff.png`
            ),
            data.getBuffer()
          );

          // fail test
          throw new Error(
            `Visual mismatch detected in test: ${testFixture}/${testName}. Please investigate.`
          );
        }
      });
  }

  if (!isBaseScreenshotTaken) {
    // take base screenshot
    await t.takeScreenshot(path.join("base", testFixture, `${testName}.png`));
  }
};

export default doVisualRegression;
