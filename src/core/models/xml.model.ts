export type XmlNodeValue = string | XmlNodeObject | XmlNodeValue[];

export interface XmlNodeObject {
  [key: string]: XmlNodeValue | undefined;
}

export type XmlAttributes = Record<string, string>;
