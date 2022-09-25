import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";
describe("codegen", () => {
  it("string", () => {
    const ast = baseParse("hi");
    transform(ast);
    const { code } = generate(ast);

    // 快照(string)
    // 1. 抓bug
    // 2. 有意()
    expect(code).toMatchSnapshot();
  });
});
