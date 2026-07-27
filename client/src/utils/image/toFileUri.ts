/** Converts an input path to URI form if it is not one already */
export function toFileUri(pathOrUri: string): string {
  if (pathOrUri.startsWith('file://')) {
    return pathOrUri;
  }

  return `file://${pathOrUri}`;
}
