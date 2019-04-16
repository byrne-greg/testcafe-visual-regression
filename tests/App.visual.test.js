import doVisualRegression from "./vrt-util/vrtUtil";

fixture`VRT`;

test("Homepage", async t => {
  await t.navigateTo(`http://localhost:3000`);
  await doVisualRegression("VRT", "Homepage");
});
