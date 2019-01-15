// @flow
import * as Abstract from "../types";

export default function shareBody<T: Abstract.Share>(
  inputShare: Abstract.InputShare<T>
) {
  switch (inputShare.kind) {
    case "layer": {
      return {
        organizationId: inputShare.organizationId,
        projectId: inputShare.projectId,
        branchId: inputShare.branchId,
        commitSha: inputShare.sha,
        fileId: inputShare.fileId,
        pageId: inputShare.pageId,
        layerId: inputShare.layerId,
        mode: inputShare.mode
      };
    }
    default: {
      throw new Error("InputShare.kind required");
    }
  }
}
