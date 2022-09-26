import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";
import { transformExpression } from "../src/transforms/transfomExpression";
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

  it("interpolation", () => {
    const ast = baseParse("{{   msg  }}");
    transform(ast, {
      nodeTransforms: [transformExpression],
    });
    // console.log(ast);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});
