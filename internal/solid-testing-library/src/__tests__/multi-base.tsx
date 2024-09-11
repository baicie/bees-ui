import { render } from "..";

// These are created once per test suite and reused for each case
let treeA: HTMLDivElement;
let treeB: HTMLDivElement;

beforeAll(() => {
  treeA = document.createElement("div");
  treeB = document.createElement("div");
  document.body.appendChild(treeA);
  document.body.appendChild(treeB);
});

afterAll(() => {
  treeA.parentNode!.removeChild(treeA);
  treeB.parentNode!.removeChild(treeB);
});

test("baseElement isolates trees from one another", () => {
  const { getByText: getByTextInA } = render(() => <div>Jekyll</div>, {
    baseElement: treeA
  });

  const { getByText: getByTextInB } = render(() => <div>Hyde</div>, {
    baseElement: treeB
  });

  expect(() => getByTextInA("Jekyll")).not.toThrow(
    "Unable to find an element with the text: Jekyll."
  );

  expect(() => getByTextInB("Jekyll")).toThrow("Unable to find an element with the text: Jekyll.");

  expect(() => getByTextInA("Hyde")).toThrow("Unable to find an element with the text: Hyde.");

  expect(() => getByTextInB("Hyde")).not.toThrow("Unable to find an element with the text: Hyde.");
});
