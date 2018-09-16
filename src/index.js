// @flow
import abstractClient from "./abstractClient";

export { abstractClient };

export type ProjectDescriptor = {|
  projectId: string
|};

export type ObjectDescriptor = {|
  projectId: string,
  branchId: string | "master",
  sha?: string | "latest" // undefined is "latest"
|};

export type BranchDescriptor = ObjectDescriptor;

export type CollectionDescriptor = {|
  ...ObjectDescriptor,
  collectionId: string
|};

export type FileDescriptor = {|
  ...ObjectDescriptor,
  fileId: string
|};

export type PageDescriptor = {|
  ...ObjectDescriptor,
  fileId: string,
  pageId: string
|};

export type LayerDescriptor = {|
  ...ObjectDescriptor,
  fileId: string,
  pageId: string,
  layerId: string
|};

export type Cursor<T> = Promise<{
  value: T,
  done: boolean
}> & {
  currentPage: number // possibly under pageInfo?
  // next(): <T>Cursor,
  // [Symbol.asyncIterator](): string
};

export interface AbstractTransport {
  ({ abstractToken: string, abstractCliPath?: string[] }): void;
  abstractCliPath: string;
}

export interface AbstractInterface {
  abstractToken: string;
  layers: {
    data: (projectDescriptor: ProjectDescriptor) => Promise<*>
  };
}
