// @flow

export default function parseShareURL(url: string): string {
  return url.split("share.goabstract.com/")[1];
}
