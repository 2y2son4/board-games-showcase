export type XmlAttributes = Record<string, string>;

export interface XmlNodeObject {
  [key: string]: XmlNodeValue | XmlAttributes | undefined;
}

export type XmlNodeValue = string | XmlNodeObject | XmlNodeValue[];
