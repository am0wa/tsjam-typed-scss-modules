import { type Implementations, IMPLEMENTATIONS } from "../../lib/index.js";

export const describeAllImplementations = (
  fn: (implementation: Implementations) => void
) => {
  IMPLEMENTATIONS.forEach((implementation) => {
    describe(`${implementation} implementation`, () => {
      fn(implementation);
    });
  });
};
