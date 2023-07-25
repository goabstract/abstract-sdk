jest.mock("child_process", () => ({
  ...jest.requireActual("child_process"),
  spawn: jest.fn()
}));
