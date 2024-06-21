export interface IPako {
  inflate(data: Uint8Array | ArrayBuffer, options?: any): Uint8Array | string;
  deflate(data: Uint8Array | ArrayBuffer | string, options?: any): Uint8Array;
}
