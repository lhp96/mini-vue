import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";
import { transformExpression } from "../src/transforms/transfomExpression";
import { transformElement } from "../src/transforms/transformElement";
import { transformText } from "../src/transforms/transformText";
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

  it("element", () => {
    const ast = baseParse(`<div><p></p></div>`);
    transform(ast, {
      nodeTransforms: [transformElement],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  it("element Nested", () => {
    const ast = baseParse(`<div><p></p><t></t><p></p></div>`);
    transform(ast, {
      nodeTransforms: [transformElement],
    });
    // console.log(ast.codegenNode.children);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  it("element & text & interpolation", () => {
    const ast: any = baseParse(`<div>hi,{{  message }}</div>`);
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  it("complex template", () => {
    const ast: any = baseParse(
      `<div>hi,{{count}}---- written by lhp96<h1>have a nice Day</h1><p>2022.9.28</p></div>`
    );
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});
