// @flow
import uuid from "uuid/v4";

export default function randomTraceId() {
  return `Root=1-${new Date().getTime()}-${uuid()}`;
}
